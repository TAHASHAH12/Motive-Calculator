const GOOGLE_SHEETS_API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || 'YOUR_API_KEY_HERE';
const SPREADSHEET_ID = '1wpg3KmrJkaE25GFWC4msdogELjpOiqCl1EYva6x6PEk';

export const fetchGoogleSheetsData = async () => {
  try {
    // Fetch QA Accuracy sheet
    const qaResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/QA Accuracy!A:DZ?key=${GOOGLE_SHEETS_API_KEY}`
    );
    
    // Fetch Weekly KPI STATS sheet  
    const kpiResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Weekly KPI STATS!A:BZ?key=${GOOGLE_SHEETS_API_KEY}`
    );

    if (!qaResponse.ok || !kpiResponse.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }

    const qaData = await qaResponse.json();
    const kpiData = await kpiResponse.json();

    return {
      qaData: processQAData(qaData.values),
      kpiData: processKPIData(kpiData.values)
    };
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    
    // Return demo data as fallback
    return getDemoData();
  }
};

const processQAData = (rawData) => {
  if (!rawData || rawData.length < 3) return [];

  // Row 3 contains the actual headers - we don't need to store it
  const dataRows = rawData.slice(3).filter(row => row.length > 10);

  return dataRows.map(row => {
    const weekRange = row[0] || '';
    const name = row[2] || '';
    const email = row[3] || '';
    
    // Parse QA scores based on Excel structure - CORRECTED INDICES
    const newTagsScore = parseFloat(row[127]) || 0; // Column DE (New Tags QA)
    const collisionScore = parseFloat(row[128]) || 0; // Column DF (Collisions QA)  
    const otherTagsScore = parseFloat(row[129]) || 0; // Column DG (Other Tags QA)
    
    // CORRECTED: Overall score is the sum of weighted category scores
    const overallScore = newTagsScore + collisionScore + otherTagsScore;

    // Individual tag accuracies - CORRECTED INDICES
    const rrlAccuracy = parseFloat(row[13]) || 0; // RRL accuracy
    const laneAccuracy = parseFloat(row[19]) || 0; // Lane Cutoff accuracy
    const fcwAccuracy = parseFloat(row[43]) || 0; // FCW accuracy
    const smokingAccuracy = parseFloat(row[49]) || 0; // Smoking accuracy
    const collisionAccuracy = parseFloat(row[61]) || 0; // Collision accuracy
    const nearCollisionAccuracy = parseFloat(row[67]) || 0; // Near Collision accuracy

    return {
      weekRange,
      name,
      email,
      overallScore, // This is now correctly calculated as sum of category scores
      newTagsScore, // Out of 20 points
      collisionScore, // Out of 30 points  
      otherTagsScore, // Out of 50 points
      rrlAccuracy,
      laneAccuracy,
      fcwAccuracy,
      smokingAccuracy,
      collisionAccuracy,
      nearCollisionAccuracy,
      rawData: row
    };
  }).filter(item => item.name && item.name.includes('Taha'));
};

const processKPIData = (rawData) => {
  if (!rawData || rawData.length < 2) return [];

  // Row 2 contains headers - we don't need to store it
  const dataRows = rawData.slice(2).filter(row => row.length > 10);

  return dataRows.map(row => {
    const weekRange = row[0] || '';
    const name = row[2] || '';
    
    // Parse KPI metrics based on Excel structure
    const punctuality = parseFloat(row[5]?.replace('%', '')) || 0;
    const punctualityGrade = parseInt(row[6]) || 0;
    const downloadTime = parseFloat(row[11]) || 0;
    const downloadTimeGrade = parseInt(row[12]) || 0;
    const timeOnVA = parseFloat(row[14]) || 0;
    const targetAchievement = parseFloat(row[22]) || 0;
    const qaScore = parseFloat(row[60]?.replace('%', '')) || 0;
    const qaGrade = parseInt(row[61]) || 0;
    const qaCategory = row[62] || '';

    return {
      weekRange,
      name,
      punctuality,
      punctualityGrade,
      downloadTime,
      downloadTimeGrade,
      timeOnVA,
      targetAchievement,
      qaScore,
      qaGrade,
      qaCategory,
      rawData: row
    };
  }).filter(item => item.name && item.name.includes('Taha'));
};

const getDemoData = () => {
  return {
    qaData: [
      {
        weekRange: '25 Aug - 31 Aug',
        name: 'Taha Shah',
        email: 'taha.shah@keeptruckin.com',
        // CORRECTED: Overall score is sum of category scores
        overallScore: 95.4, // 19.5 + 25.9 + 50.0
        newTagsScore: 19.5, // Out of 20 points
        collisionScore: 25.9, // Out of 30 points
        otherTagsScore: 50.0, // Out of 50 points
        rrlAccuracy: 94.74,
        laneAccuracy: 100,
        fcwAccuracy: 100,
        smokingAccuracy: 91.67,
        collisionAccuracy: 100,
        nearCollisionAccuracy: 100
      },
      {
        weekRange: '01 Sep - 07 Sep',
        name: 'Taha Shah',
        email: 'taha.shah@keeptruckin.com',
        overallScore: 100, // 20.0 + 30.0 + 50.0
        newTagsScore: 20.0,
        collisionScore: 30.0,
        otherTagsScore: 50.0,
        rrlAccuracy: 100,
        laneAccuracy: 100,
        fcwAccuracy: 100,
        smokingAccuracy: 100,
        collisionAccuracy: 100,
        nearCollisionAccuracy: 100
      }
    ],
    kpiData: [
      {
        weekRange: '25 Aug - 31 Aug',
        name: 'Taha Shah',
        punctuality: 100,
        punctualityGrade: 5,
        downloadTime: 3.95,
        downloadTimeGrade: 1,
        timeOnVA: 96.08,
        targetAchievement: 134.19,
        qaScore: 100,
        qaGrade: 5,
        qaCategory: 'Outstanding'
      },
      {
        weekRange: '01 Sep - 07 Sep',
        name: 'Taha Shah',
        punctuality: 100,
        punctualityGrade: 5,
        downloadTime: 3.42,
        downloadTimeGrade: 1,
        timeOnVA: 87.53,
        targetAchievement: 147.54,
        qaScore: 100,
        qaGrade: 5,
        qaCategory: 'Outstanding'
      }
    ]
  };
};
