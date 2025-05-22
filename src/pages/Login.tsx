
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is a placeholder authentication logic
    // In a real app, you would connect this to your authentication service
    if (email && password) {
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please enter both email and password.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-h-screen flex items-start justify-center pt-20 p-4"
      style={{
        background: `
          linear-gradient(to bottom, rgba(10, 31, 68, 0.85), rgba(20, 44, 102, 0.85))
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}
    >
      {/* Add NOLADAD watermark/logo as a separate element */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25"
        style={{ zIndex: 0 }}
      >
        <h1 className="text-white text-[12rem] font-bold tracking-wider">NOLADAD</h1>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center">
          {/* Increased margin-top for button positioning */}
          {!showLoginForm && (
            <Button 
              className="w-1/2 bg-insight-800 hover:bg-[#4C6EF5] text-white mt-[400px] shadow-lg shadow-[#0A1F44]/50 transition-all duration-300"
              onClick={() => setShowLoginForm(true)}
            >
              Access Portal
            </Button>
          )}
        </div>

        {showLoginForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Login Card with enhanced shadow */}
            <Card className="shadow-2xl shadow-[#0A1F44]/40 border-[#142C66] bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <h2 className="text-xl font-semibold">Login to Your Account</h2>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a 
                        href="#" 
                        className="text-xs text-[#4C6EF5] hover:text-[#3859E9]"
                        onClick={(e) => {
                          e.preventDefault();
                          toast({
                            title: "Password Reset",
                            description: "Password reset functionality would be implemented here.",
                          });
                        }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="rememberMe" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#142C66] hover:bg-[#4C6EF5] text-white transition-colors duration-300"
                  >
                    Enter Your AI Workspace
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="justify-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Noladad Agentic Agencies
              </CardFooter>
            </Card>
            
            <div className="text-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLoginForm(false)}
                className="text-[#4C6EF5] border-[#142C66]/30 hover:bg-[#142C66]/10"
              >
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Login;
