import { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import PaymentForm from "./PaymentForm"; // Import the hosted Stripe checkout
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/utils/Stripe";
import { API_URL } from "@/utils/path";

interface Plan {
  id: number;
  stripePriceId: string;
  billingInterval: string;
  price: number;
  currency: string;
  features: {
    ai: boolean;
    ads: boolean;
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  tier: string; // "basic", "standard", "premium"
  plans: Plan[];
}

interface Props {
  roleId: number;
  onClose: () => void;
}

const TIER_TABS = ["basic", "standard", "premium"];

const SubscriptionPopup = ({ roleId, onClose }: Props) => {
  const [plans, setPlans] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>("basic");
  const [selectedSubPlan, setSelectedSubPlan] = useState<Plan | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
        const res = await axios.get(
          `${API_URL}/stripe/product/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [roleId]);

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    setSelectedSubPlan(null);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
    const user = localStorage.getItem("loginData")
    console.log(user ? JSON.parse(user) : '');
    const email = user ? JSON.parse(user).email : null;
   
    if (!selectedSubPlan?.stripePriceId || !email) {
      alert("Missing subplan or user email.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priceId: selectedSubPlan.stripePriceId,
            userEmail: email,
          }),
        }
      );

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      alert("Checkout failed.");
      console.error(err);
    }
  };

  if (clientSecret) {
    return (
      <div className="fixed inset-0 bg-white z-50 scroll-auto">
        <Elements stripe={stripePromise}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-4xl p-6 max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Choose a Plan</h2>

        {loading ? (
          <div className="text-center py-10 text-lg">Loading plans...</div>
        ) : (
          <>
            <div className="flex justify-center mb-6 space-x-4">
              {TIER_TABS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleTierSelect(tier)}
                  className={clsx(
                    "px-4 py-2 rounded-full border text-sm capitalize transition",
                    {
                      "bg-black text-white": selectedTier === tier,
                      "bg-white text-black hover:bg-gray-100": selectedTier !== tier,
                    }
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((product) => {
                const isSelectedTier = selectedTier === product.tier.toLowerCase();
                const isDimmed = selectedTier && !isSelectedTier;

                return (
                  <div
                    key={product.id}
                    className={clsx(
                      "border rounded-xl p-4 transition shadow-sm relative",
                      {
                        "opacity-30 pointer-events-none blur-[1px]": isDimmed,
                        "hover:shadow-lg": !isDimmed,
                      }
                    )}
                  >
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                    {product.plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={clsx(
                          "border rounded-md p-3 mb-2 bg-gray-50 cursor-pointer transition",
                          {
                            "ring-2 ring-black":
                              selectedSubPlan?.id === plan.id && isSelectedTier,
                            "hover:bg-gray-100": isSelectedTier,
                          }
                        )}
                        onClick={() => isSelectedTier && setSelectedSubPlan(plan)}
                      >
                        <div className="font-medium text-sm">
                          {plan.billingInterval.toUpperCase()} –{" "}
                          {plan.currency.toUpperCase()} {plan.price}
                        </div>
                        <ul className="text-xs text-gray-700 mt-1 space-y-1">
                          <li>AI: {plan.features.ai ? "✔️" : "❌"}</li>
                          <li>Ads: {plan.features.ads ? "✔️" : "❌"}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-6">
              <button
                className={clsx("px-6 py-2 rounded text-white font-medium", {
                  "bg-black hover:bg-gray-800":
                    selectedTier && selectedSubPlan?.stripePriceId,
                  "bg-gray-300 cursor-not-allowed":
                    !selectedTier || !selectedSubPlan?.stripePriceId,
                })}
                disabled={!selectedTier || !selectedSubPlan?.stripePriceId}
                onClick={handleCheckout}
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPopup;
