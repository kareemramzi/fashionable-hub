
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AddWardrobeItemProps {
  onBack: () => void;
}

const AddWardrobeItem = ({ onBack }: AddWardrobeItemProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemBrand, setItemBrand] = useState("");
  const [itemColor, setItemColor] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Trigger the file input to access camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddItem = async () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wardrobe",
      });
      return;
    }

    if (!selectedImage || !itemName || !itemBrand || !itemColor || !itemCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select an image",
      });
      return;
    }

    setIsUploading(true);

    try {
      // First, create a product entry for the user's item
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name: itemName,
          brand: itemBrand,
          color: itemColor,
          category: itemCategory,
          price: 0, // User's own items have no price
          image_url: imagePreview!, // Use the preview URL for now
          description: `Personal item added by user`,
          is_active: false, // Mark as inactive so it doesn't appear in shop
          stock_quantity: 1
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      // Then add it to the user's wardrobe
      const { error: wardrobeError } = await supabase
        .from('wardrobe_items')
        .insert({
          user_id: session.user.id,
          product_id: productData.id,
          size: 'Custom',
          purchase_date: new Date().toISOString()
        });

      if (wardrobeError) {
        throw wardrobeError;
      }

      toast({
        title: "Item added successfully! ✨",
        description: `${itemName} has been added to your wardrobe`,
      });

      // Reset form
      setSelectedImage(null);
      setImagePreview(null);
      setItemName("");
      setItemBrand("");
      setItemColor("");
      setItemCategory("");
      
      // Go back to wardrobe
      onBack();

    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Could not add item to wardrobe",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Add to Wardrobe</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Add Your Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Item Photo</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Item preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <label className="flex-1">
                      <Button variant="outline" className="w-full" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center text-gray-500">
                    No image selected
                  </div>
                </div>
              )}
            </div>

            {/* Item Details Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Blue Denim Jacket"
                />
              </div>

              <div>
                <Label htmlFor="itemBrand">Brand</Label>
                <Input
                  id="itemBrand"
                  value={itemBrand}
                  onChange={(e) => setItemBrand(e.target.value)}
                  placeholder="e.g., Zara, H&M, Uniqlo"
                />
              </div>

              <div>
                <Label htmlFor="itemColor">Color</Label>
                <Input
                  id="itemColor"
                  value={itemColor}
                  onChange={(e) => setItemColor(e.target.value)}
                  placeholder="e.g., Navy Blue, Black, White"
                />
              </div>

              <div>
                <Label htmlFor="itemCategory">Category</Label>
                <Select value={itemCategory} onValueChange={setItemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="bottoms">Bottoms</SelectItem>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddItem}
              disabled={isUploading || !selectedImage || !itemName || !itemBrand || !itemColor || !itemCategory}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Item...
                </div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Wardrobe
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWardrobeItem;
