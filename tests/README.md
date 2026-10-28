# Test checklist

Before using real patient data, add automated and manual tests for:

- Authentication and account recovery.
- Role boundaries for all five roles.
- RLS policies for every sensitive table.
- Patient A cannot read Patient B's records.
- Doctors/nurses can only access records allowed by policy.
- Appointment slot race conditions and duplicate booking prevention.
- Token uniqueness under concurrent requests.
- File upload/download authorization and expiry.
- Prescription signing and immutable audit trail.
- Invoice calculations, payment webhook verification, and refunds.
- WhatsApp/SMS consent, idempotency, failure, and retry handling.
- English/Tamil/Hindi translations and mobile accessibility.
- Audit logging and sensitive-data redaction.
