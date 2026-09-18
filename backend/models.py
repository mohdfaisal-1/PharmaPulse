from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

class ComplaintRecord(Base):
    __tablename__ = "complaint_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(String(50), unique=True, index=True, nullable=False)
    complaint_source = Column(String(255), nullable=True)
    customer_name = Column(String(255), nullable=True)
    product_name = Column(String(255), nullable=True)
    product_strength_grade = Column(String(255), nullable=True)
    batch_lot_number = Column(String(100), index=True, nullable=True)
    mfg_date = Column(String(50), nullable=True)
    expiry_date = Column(String(50), nullable=True)
    quantity_affected = Column(String(50), nullable=True)
    quantity_unit = Column(String(50), default="kg", nullable=True)
    complaint_type = Column(String(100), nullable=True)
    complaint_date = Column(String(50), nullable=True)
    detailed_description = Column(Text, nullable=True)
    initial_severity = Column(String(50), default="Major")
    priority = Column(String(50), default="High")
    status = Column(String(100), default="Logged / Pending Triage")
    patient_safety_risk = Column(String(255), nullable=True)
    regulatory_impact = Column(Text, nullable=True)
    suggested_root_cause = Column(Text, nullable=True)
    immediate_action = Column(Text, nullable=True)
    capa_recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "complaint_id": self.complaint_id,
            "complaint_source": self.complaint_source,
            "customer_name": self.customer_name,
            "product_name": self.product_name,
            "product_strength_grade": self.product_strength_grade,
            "batch_lot_number": self.batch_lot_number,
            "mfg_date": self.mfg_date,
            "expiry_date": self.expiry_date,
            "quantity_affected": self.quantity_affected,
            "quantity_unit": self.quantity_unit or "kg",
            "complaint_type": self.complaint_type,
            "complaint_date": self.complaint_date,
            "detailed_description": self.detailed_description,
            "initial_severity": self.initial_severity,
            "priority": self.priority,
            "status": self.status,
            "patient_safety_risk": self.patient_safety_risk,
            "regulatory_impact": self.regulatory_impact,
            "suggested_root_cause": self.suggested_root_cause,
            "immediate_action": self.immediate_action,
            "capa_recommendation": self.capa_recommendation,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            # Frontend camelCase contract aliases
            "formData": {
                "complaintSource": self.complaint_source,
                "customerName": self.customer_name,
                "productName": self.product_name,
                "productStrengthGrade": self.product_strength_grade,
                "batchLotNumber": self.batch_lot_number,
                "mfgDate": self.mfg_date,
                "expiryDate": self.expiry_date,
                "quantityAffected": self.quantity_affected,
                "quantityUnit": self.quantity_unit or "kg",
                "complaintType": self.complaint_type,
                "complaintDate": self.complaint_date,
                "detailedDescription": self.detailed_description,
                "initialSeverity": self.initial_severity,
                "priority": self.priority,
            },
            "riskAssessment": {
                "patientSafetyRisk": self.patient_safety_risk,
                "regulatoryImpact": self.regulatory_impact,
                "suggestedRootCause": self.suggested_root_cause,
                "immediateAction": self.immediate_action,
                "capaRecommendation": self.capa_recommendation,
            }
        }

