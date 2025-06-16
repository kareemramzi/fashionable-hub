import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ShoppingBag, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TopNavBar from "../navigation/TopNavBar";

interface CartItem {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  size: string;
  color: string;
  image_url: string;
  quantity: number;
}

interface ShoppingCartProps {
  onBack: () => void;
  onCheckout: (items: CartItem[], total: number) => void;
  onFavorites: () => void;
  onProfile: () => void;
  onShopping: () => void;
}

const ShoppingCart = ({ onBack, onCheckout, onFavorites, onProfile, onShopping }: ShoppingCartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCartItems();
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setCustomerEmail(user.email);
    }
  };

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading cart",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error: any) {
      toast({
        title: "Error updating quantity",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items => items.filter(item => item.id !== itemId));
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleStripeCheckout = async () => {
    if (!customerEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please provide your email address",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      console.log('Starting checkout with items:', cartItems);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: cartItems,
          customer_email: customerEmail.trim(),
          customer_name: customerName.trim() || undefined,
        }
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to:', data.url);
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: "Opening checkout in a new tab",
        });
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <TopNavBar 
        onBack={onBack}
        onFavorites={onFavorites}
        onCart={() => {}} // Already on cart page
        onProfile={onProfile}
        showBackButton={true}
        title="Shopping Cart"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {cartItems.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Start shopping to add items to your cart</p>
              <Button onClick={onShopping} className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-600">
                          {item.color} • Size {item.size}
                        </p>
                        <p className="font-bold text-purple-600">${item.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {showCheckoutForm ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Checkout Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name (Optional)</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg mb-4">
                      <span>Total</span>
                      <span>EGP {calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCheckoutForm(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleStripeCheckout}
                        disabled={isCheckingOut}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        {isCheckingOut ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Pay with Card
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>EGP {calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>EGP {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
