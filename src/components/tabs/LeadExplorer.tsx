
import React from "react";
import { Button } from "@/components/ui/button";
import useLeadExplorer from "@/hooks/useLeadExplorer";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadTable from "@/components/leads/LeadTable";
import LeadDetailPanel from "@/components/leads/LeadDetailPanel";
import PredictiveInsightModal from "@/components/modals/PredictiveInsightModal";

const LeadExplorer: React.FC = () => {
  const {
    // State
    scoreRange,
    setScoreRange,
    intentFilter,
    setIntentFilter,
    companyFilter,
    setCompanyFilter,
    searchQuery,
    setSearchQuery,
    isDetailOpen,
    setIsDetailOpen,
    selectedLead,
    sortField,
    sortDirection,
    isPredictionModalOpen,
    setIsPredictionModalOpen,
    selectedLeadForPrediction,
    
    // Data
    leads,
    isLoading,
    error,
    refetch,
    
    // Functions
    handleRowClick,
    handleViewPrediction,
    handleReanalyze,
    handleSort,
  } = useLeadExplorer();

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading leads data.</p>
        <Button onClick={() => refetch()} className="mt-2">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Explorer</h2>
        <Button onClick={() => refetch()} variant="outline">Refresh Data</Button>
      </div>
      
      {/* Filters */}
      <LeadFilters
        scoreRange={scoreRange}
        setScoreRange={setScoreRange}
        intentFilter={intentFilter}
        setIntentFilter={setIntentFilter}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Leads Table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleRowClick={handleRowClick}
        handleViewPrediction={handleViewPrediction}
      />
      
      {/* Side Panel for Lead Details */}
      <LeadDetailPanel
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        selectedLead={selectedLead}
        onReanalyze={handleReanalyze}
      />
      
      {/* Prediction Modal */}
      <PredictiveInsightModal
        open={isPredictionModalOpen}
        onOpenChange={setIsPredictionModalOpen}
        leadData={selectedLeadForPrediction}
      />
    </div>
  );
};

export default LeadExplorer;
