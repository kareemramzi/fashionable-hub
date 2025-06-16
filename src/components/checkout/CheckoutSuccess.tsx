
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CheckoutSuccessProps {
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

const CheckoutSuccess = ({ onContinueShopping, onViewOrders }: CheckoutSuccessProps) => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      handleOrderConfirmation(sessionId);
    }
  }, [searchParams]);

  const handleOrderConfirmation = async (sessionId: string) => {
    try {
      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-order-email', {
        body: { session_id: sessionId }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "Order Confirmed",
          description: "Your payment was successful, but we couldn't send the confirmation email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Order Confirmed! 🎉",
          description: "Your payment was successful and confirmation email has been sent.",
        });
      }

      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (!orderError && order) {
        setOrderDetails(order);
      }

      // Clear cart items for authenticated users
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      }

    } catch (error: any) {
      console.error('Error in order confirmation:', error);
      toast({
        title: "Order Processing",
        description: "Your payment was successful. Order details will be sent to your email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Confirming your order...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                Thank you for your purchase! Your order has been confirmed and payment processed successfully.
              </p>
              {orderDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Order ID: <span className="font-mono">{orderDetails.id}</span></p>
                  <p className="text-sm text-gray-600">Total: <span className="font-semibold">EGP {(orderDetails.amount / 100).toFixed(2)}</span></p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Email Confirmation</p>
                  <p className="text-sm text-blue-600">Order details sent to your email</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Processing</p>
                  <p className="text-sm text-purple-600">Your order will be shipped soon</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onViewOrders}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                View My Orders
              </Button>
              <Button
                onClick={onContinueShopping}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
