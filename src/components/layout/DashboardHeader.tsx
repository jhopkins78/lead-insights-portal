
import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, User, CreditCard, HelpCircle, Code, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Product, SamaritanGroup } from "@/types/dashboard";

interface DashboardHeaderProps {
  selectedProduct: string;
  handleProductChange: (productId: string) => void;
  products: Product[];
  isSamaritanAI: boolean;
  activeSamaritanGroup: string;
  samaritanGroups: SamaritanGroup[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedProduct,
  handleProductChange,
  products,
  isSamaritanAI,
  activeSamaritanGroup,
  samaritanGroups
}) => {
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = () => {
    // In a real app, you'd clear auth tokens here
    navigate("/login");
  };

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-insight-900 flex items-center gap-2">
            <span className="bg-insight-500 text-white p-1 rounded">AI</span>
            Intelligence Dashboard
          </h1>
          
          {/* Product Selector */}
          <Select value={selectedProduct} onValueChange={handleProductChange}>
            <SelectTrigger className="w-[220px] border-insight-200 hover:bg-insight-50">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem 
                  key={product.id} 
                  value={product.id}
                  disabled={product.id === "startup-advisor" || product.id === "retail-advisor"}
                >
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Show active Samaritan group if applicable */}
          {isSamaritanAI && (
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <span className="text-slate-400">→</span>
              <span>{samaritanGroups.find(g => g.id === activeSamaritanGroup)?.name}</span>
            </div>
          )}
        </div>
        
        {/* Settings Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="border-insight-200 hover:bg-insight-50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Code className="mr-2 h-4 w-4" />
              <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>Docs</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
