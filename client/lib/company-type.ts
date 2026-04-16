export type CompanyType = "startup" | "product" | "mnc"

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  startup: "Startup",
  product: "Product",
  mnc: "MNC",
}

export const COMPANY_TYPE_OPTIONS: Array<{ value: CompanyType; label: string }> = [
  { value: "startup", label: "Startup" },
  { value: "product", label: "Product" },
  { value: "mnc", label: "MNC" },
]

const PRODUCT_COMPANIES = new Set([
  "google", "meta", "microsoft", "apple", "amazon", "netflix", "uber", "airbnb",
  "linkedin", "spotify", "dropbox", "adobe", "atlassian", "servicenow", "salesforce",
  "nvidia", "intel", "amd", "qualcomm", "oracle", "sap", "zoho", "freshworks",
  "browserstack", "postman", "inmobi", "flipkart", "swiggy", "zomato", "razorpay",
  "cred", "phonepe", "paytm", "stripe",
])

const MNC_COMPANIES = new Set([
  "tcs", "infosys", "wipro", "hcl", "accenture", "capgemini", "cognizant", "ibm",
  "deloitte", "ey", "pwc", "kpmg", "goldman sachs", "morgan stanley", "jpmorgan chase",
  "visa", "mastercard", "vmware",
])

const STARTUP_COMPANIES = new Set([
  "razorpay", "cred", "swiggy", "zomato", "inmobi", "browserstack", "postman",
  "freshworks", "airbnb", "stripe", "dropbox",
])

export function inferCompanyType(name: string): CompanyType {
  const normalized = name.trim().toLowerCase()
  if (STARTUP_COMPANIES.has(normalized)) return "startup"
  if (MNC_COMPANIES.has(normalized)) return "mnc"
  if (PRODUCT_COMPANIES.has(normalized)) return "product"
  return normalized.includes("labs") || normalized.includes("tech") ? "startup" : "mnc"
}

export function getCompanyType(value?: string | null, companyName?: string) {
  if (value === "startup" || value === "product" || value === "mnc") return value
  return inferCompanyType(companyName ?? "")
}
