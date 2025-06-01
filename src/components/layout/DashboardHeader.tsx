import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import DataUploadHub from "@/components/upload/DataUploadHub";

interface DashboardHeaderProps {
  selectedProduct: string;
  handleProductChange: (product: string) => void;
  products: { id: string; name: string }[];
  isSamaritanAI: boolean;
  activeSamaritanGroup: string;
  samaritanGroups: { id: string; name: string }[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedProduct,
  handleProductChange,
  products,
  isSamaritanAI,
  activeSamaritanGroup,
  samaritanGroups,
}) => {
  const currentGroup = samaritanGroups.find(group => group.id === activeSamaritanGroup);

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-insight-500 to-insight-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lead Commander</h1>
                <p className="text-sm text-gray-500">
                  {isSamaritanAI 
                    ? `${currentGroup?.name} • Advanced AI Analytics` 
                    : "AI-Powered Lead Intelligence Platform"
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Data Upload Hub */}
            <DataUploadHub />
            
            {/* Product Selector */}
            <Select value={selectedProduct} onValueChange={handleProductChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Samaritan Group Selector - only show if Samaritan AI is selected */}
            {isSamaritanAI && (
              <Select value={activeSamaritanGroup} onValueChange={(value) => console.log("Selected Samaritan Group:", value)}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select a Samaritan Group" />
                </SelectTrigger>
                <SelectContent>
                  {samaritanGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
