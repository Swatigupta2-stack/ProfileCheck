/**
 * Curated list of major universities and their branches for "Deep Search"
 */
const CURATED_UNIVERSITIES = [
  { name: "Indian Institute of Technology", branch: "IIT Bombay", location: "Mumbai, Maharashtra", country: "India" },
  { name: "Indian Institute of Technology", branch: "IIT Delhi", location: "New Delhi, Delhi", country: "India" },
  { name: "Indian Institute of Technology", branch: "IIT Madras", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "Indian Institute of Technology", branch: "IIT Kanpur", location: "Kanpur, Uttar Pradesh", country: "India" },
  { name: "Indian Institute of Technology", branch: "IIT Kharagpur", location: "Kharagpur, West Bengal", country: "India" },
  { name: "Indian Institute of Technology", branch: "IIT Roorkee", location: "Roorkee, Uttarakhand", country: "India" },
  { name: "Indian Institute of Technology", branch: "IIT Guwahati", location: "Guwahati, Assam", country: "India" },
  { name: "National Institute of Technology", branch: "NIT Trichy", location: "Tiruchirappalli, Tamil Nadu", country: "India" },
  { name: "National Institute of Technology", branch: "NIT Surathkal", location: "Mangalore, Karnataka", country: "India" },
  { name: "National Institute of Technology", branch: "NIT Warangal", location: "Warangal, Telangana", country: "India" },
  { name: "SRM Institute of Science and Technology", branch: "Kattankulathur Campus", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "SRM Institute of Science and Technology", branch: "Ramapuram Campus", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "SRM Institute of Science and Technology", branch: "Vadapalani Campus", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "SRM Institute of Science and Technology", branch: "NCR Campus", location: "Modinagar, Uttar Pradesh", country: "India" },
  { name: "Vellore Institute of Technology", branch: "VIT Vellore", location: "Vellore, Tamil Nadu", country: "India" },
  { name: "Vellore Institute of Technology", branch: "VIT Chennai", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "Vellore Institute of Technology", branch: "VIT Bhopal", location: "Bhopal, Madhya Pradesh", country: "India" },
  { name: "Vellore Institute of Technology", branch: "VIT Andhra Pradesh", location: "Amaravati, Andhra Pradesh", country: "India" },
  { name: "Anna University", branch: "CEG Campus", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "Anna University", branch: "MIT Campus", location: "Chennai, Tamil Nadu", country: "India" },
  { name: "BITS Pilani", branch: "Pilani Campus", location: "Pilani, Rajasthan", country: "India" },
  { name: "BITS Pilani", branch: "Goa Campus", location: "Zuarinagar, Goa", country: "India" },
  { name: "BITS Pilani", branch: "Hyderabad Campus", location: "Hyderabad, Telangana", country: "India" },
  { name: "Stanford University", branch: "Main Campus", location: "Stanford, California", country: "USA" },
  { name: "Harvard University", branch: "Main Campus", location: "Cambridge, Massachusetts", country: "USA" },
  { name: "Massachusetts Institute of Technology", branch: "Main Campus", location: "Cambridge, Massachusetts", country: "USA" },
  { name: "University of Oxford", branch: "Main Campus", location: "Oxford, Oxfordshire", country: "UK" },
  { name: "University of Cambridge", branch: "Main Campus", location: "Cambridge, Cambridgeshire", country: "UK" },
];

/**
 * Search for universities and their branches using a hybrid approach
 * @param {string} query - The search query
 * @returns {Promise<Array>} List of universities with branches and locations
 */
export async function searchUniversitiesAI(query) {
  if (!query || query.length < 2) return [];

  console.log(`[University AI] Searching for: "${query}"`);
  const lowerQuery = query.toLowerCase();
  
  // 1. Check curated list first (Deep Search)
  const curatedMatches = CURATED_UNIVERSITIES.filter(u => 
    u.name.toLowerCase().includes(lowerQuery) || 
    u.branch.toLowerCase().includes(lowerQuery) ||
    (u.location && u.location.toLowerCase().includes(lowerQuery))
  );
  console.log(`[University AI] Curated matches found: ${curatedMatches.length}`);

  // 2. Fallback to HipoLabs API for broader search
  let apiMatches = [];
  try {
    const apiUrl = `http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`;
    console.log(`[University AI] Fetching from HipoLabs: ${apiUrl}`);
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      console.log(`[University AI] HipoLabs results: ${data.length}`);
      apiMatches = data.slice(0, 10).map(u => ({
        name: u.name,
        branch: "Main Campus",
        location: u["state-province"] || "City Unknown",
        country: u.country
      }));
    } else {
      console.warn(`[University AI] HipoLabs API returned status: ${res.status}`);
    }
  } catch (err) {
    console.error("[University Service] API Fallback Error:", err.message);
  }

  // 3. Combine results, prioritizing curated ones and removing duplicates
  const combined = [...curatedMatches];
  const existingNames = new Set(combined.map(u => `${u.name}-${u.branch}`.toLowerCase()));

  for (const match of apiMatches) {
    const key = `${match.name}-${match.branch}`.toLowerCase();
    if (!existingNames.has(key)) {
      combined.push(match);
      existingNames.add(key);
    }
  }

  return combined.slice(0, 15);
}
