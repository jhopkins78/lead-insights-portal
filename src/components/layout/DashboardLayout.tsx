
import React from "react";
import NavigationMenu from "./NavigationMenu";
import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import useDashboardState from "@/hooks/useDashboardState";

const DashboardLayout: React.FC = () => {
  const {
    activePage,
    activeTab,
    setActiveTab,
    activeSamaritanGroup,
    products,
    samaritanGroups,
    tabInfo,
    getTabsForGroup,
    handleProductChange,
    handlePageChange,
    handleSamaritanGroupChange,
    shouldShowTab,
    currentProduct,
    availablePages,
    isSamaritanAI
  } = useDashboardState();

  // Add a console log for debugging
  console.log("Rendering DashboardLayout", { activePage, activeTab, isSamaritanAI });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-insight-100/30">
      <DashboardHeader
        selectedProduct={currentProduct.id}
        handleProductChange={handleProductChange}
        products={products}
        isSamaritanAI={isSamaritanAI}
        activeSamaritanGroup={activeSamaritanGroup}
        samaritanGroups={samaritanGroups}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg border overflow-hidden">
          <div className="p-4 border-b">
            {/* Regular Navigation Menu for Lead Commander */}
            {!isSamaritanAI && (
              <NavigationMenu 
                activePage={activePage} 
                setActivePage={handlePageChange} 
                availablePages={availablePages}
              />
            )}
            
            {/* Samaritan AI Group Navigation */}
            {isSamaritanAI && (
              <NavigationMenu 
                activePage={activeSamaritanGroup} 
                setActivePage={handleSamaritanGroupChange} 
                availablePages={samaritanGroups.map(group => group.id)}
                isSamaritanAI={true}
              />
            )}
          </div>
          
          <DashboardTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSamaritanAI={isSamaritanAI}
            activeSamaritanGroup={activeSamaritanGroup}
            activePage={activePage}
            tabInfo={tabInfo}
            shouldShowTab={shouldShowTab}
            getTabsForGroup={getTabsForGroup}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
