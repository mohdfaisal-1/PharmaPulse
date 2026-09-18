from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class ComplaintExtractionResult(BaseModel):
    complaintSource: Optional[str] = Field(default=None, description="Origin or intake channel")
    customerName: Optional[str] = Field(default=None, description="Reporting customer or entity")
    productName: Optional[str] = Field(default=None, description="Pharmaceutical product name")
    productStrengthGrade: Optional[str] = Field(default=None, description="Dosage strength or grade")
    batchLotNumber: Optional[str] = Field(default=None, description="Batch or lot identifier")
    mfgDate: Optional[str] = Field(default=None, description="Manufacturing date (YYYY-MM-DD)")
    expiryDate: Optional[str] = Field(default=None, description="Expiration date (YYYY-MM-DD)")
    quantityAffected: Optional[str] = Field(default=None, description="Affected quantity")
    quantityUnit: Optional[str] = Field(default="kg", description="Quantity unit (kg, vials, packs)")
    complaintType: Optional[str] = Field(default=None, description="Defect classification")
    complaintDate: Optional[str] = Field(default=None, description="Log date (YYYY-MM-DD)")
    detailedDescription: Optional[str] = Field(default=None, description="Defect narrative")
    initialSeverity: Literal["Minor", "Major", "Critical"] = Field(default="Major")
    priority: Literal["Low", "Medium", "High", "Urgent"] = Field(default="High")


class RiskAssessmentResult(BaseModel):
    patientSafetyRisk: str = Field(description="Patient risk assessment")
    regulatoryImpact: str = Field(description="GxP compliance exposure (e.g. EU GMP Annex 16, FDA 21 CFR Part 211)")
    suggestedRootCause: str = Field(description="Hypothesized root cause")
    immediateAction: str = Field(description="Immediate containment action")
    capaRecommendation: str = Field(description="8D/CAPA recommendation")


class DuplicateBatchInfo(BaseModel):
    isDuplicateBatch: bool = Field(default=False)
    priorComplaintIds: List[str] = Field(default_factory=list)
    duplicateAlert: Optional[str] = Field(default=None)


class CompletenessInfo(BaseModel):
    completenessScore: int = Field(default=100, description="Completeness score 0-100%")
    missingMandatoryFields: List[str] = Field(default_factory=list)
    actionRequired: Optional[str] = Field(default=None)


class ComplaintIntakeRequest(BaseModel):
    text: Optional[str] = Field(default="", description="Raw complaint body")


class ChatQueryRequest(BaseModel):
    query: str = Field(description="User query")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Current form & risk context")


class SaveComplaintRequest(BaseModel):
    formData: Dict[str, Any]
    riskAssessment: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ComplaintRecordResponse(BaseModel):
    success: bool
    complaint_id: str
    message: str
