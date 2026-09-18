from typing import Optional, Literal, Dict, Any, List
from pydantic import BaseModel, Field

class ComplaintExtractionResult(BaseModel):
    complaintSource: Optional[str] = Field(default=None, description="Origin or intake channel of complaint")
    customerName: Optional[str] = Field(default=None, description="Customer or organization reporting the defect")
    productName: Optional[str] = Field(default=None, description="Name of the pharmaceutical product")
    productStrengthGrade: Optional[str] = Field(default=None, description="Dosage strength or grade")
    batchLotNumber: Optional[str] = Field(default=None, description="Batch or lot identification number")
    mfgDate: Optional[str] = Field(default=None, description="Manufacturing date YYYY-MM-DD")
    expiryDate: Optional[str] = Field(default=None, description="Expiration date YYYY-MM-DD")
    quantityAffected: Optional[str] = Field(default=None, description="Quantity affected")
    quantityUnit: Optional[str] = Field(default="kg", description="Unit of affected quantity (kg, vials, packs)")
    complaintType: Optional[str] = Field(default=None, description="Type or category of defect")
    complaintDate: Optional[str] = Field(default=None, description="Date complaint was logged YYYY-MM-DD")
    detailedDescription: Optional[str] = Field(default=None, description="Detailed narrative of defect")
    initialSeverity: Literal["Minor", "Major", "Critical"] = Field(default="Major")
    priority: Literal["Low", "Medium", "High", "Urgent"] = Field(default="High")

class RiskAssessmentResult(BaseModel):
    patientSafetyRisk: str = Field(description="Patient health risk evaluation")
    regulatoryImpact: str = Field(description="GxP compliance impact")
    suggestedRootCause: str = Field(description="Hypothesized root cause")
    immediateAction: str = Field(description="Immediate containment action")
    capaRecommendation: str = Field(description="Recommended CAPA plan")

class DuplicateBatchInfo(BaseModel):
    isDuplicateBatch: bool = Field(default=False)
    priorComplaintIds: List[str] = Field(default_factory=list)
    duplicateAlert: Optional[str] = Field(default=None)

class CompletenessInfo(BaseModel):
    completenessScore: int = Field(default=100, description="Completeness percentage 0-100%")
    missingMandatoryFields: List[str] = Field(default_factory=list)
    actionRequired: Optional[str] = Field(default=None)

class ComplaintIntakeRequest(BaseModel):
    text: Optional[str] = Field(default="", description="Raw complaint text or email body")

class ChatQueryRequest(BaseModel):
    query: str = Field(description="User prompt or question")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Current QMS form & risk context")

class SaveComplaintRequest(BaseModel):
    formData: Dict[str, Any] = Field(description="Form data dictionary")
    riskAssessment: Optional[Dict[str, Any]] = Field(default_factory=dict, description="AI Risk Assessment dictionary")

class ComplaintRecordResponse(BaseModel):
    success: bool
    complaint_id: str
    message: str
