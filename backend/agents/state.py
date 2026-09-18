from typing import Any, Dict, List, TypedDict


class ComplaintState(TypedDict, total=False):
    raw_text: str
    extracted_data: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    validation_errors: List[str]
    completeness_info: Dict[str, Any]
    duplicate_info: Dict[str, Any]
    messages: List[Dict[str, Any]]
