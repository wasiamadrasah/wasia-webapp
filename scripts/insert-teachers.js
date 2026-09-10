require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const teachersData = [
  {
    full_name_bn: "রেজাউল করিম",
    full_name_en: "Rezaul Karim",
    designation: "প্রধান হিসাবরক্ষক",
    degree: "বি.কম",
    joining_date: "1998-06-10",
    index_number: "0005828",
    email: null,
    nid_number: "3730065814",
    contact_number: "01553327092",
    type: "teacher",
  },
  {
    full_name_bn: "রুমা আকতার",
    full_name_en: "Ruma Akter",
    designation: "সহকারী শিক্ষক",
    degree: "এমএসসি (গণিত)",
    joining_date: "2022-02-01",
    index_number: "M 0023347",
    email: "rumamun2018@gmail.com",
    nid_number: "4633118528",
    contact_number: "01817735099",
    type: "teacher",
  },
  {
    full_name_bn: "ইফফাৎ জাহান",
    full_name_en: "Iffat Jahan",
    designation: "সহকারী শিক্ষিকা",
    degree: "বি.এস.এস.(অনার্স) অর্থনীতি, এম.এস.এস.(অর্থনীতি)",
    joining_date: "2005-02-01",
    index_number: "M0005823",
    email: "iffatjahanshanta80@gmail.com",
    nid_number: "4611702947",
    contact_number: "01819631017",
    type: "teacher",
  },
  {
    full_name_bn: "মুহাম্মদ মুনির হোসেন",
    full_name_en: "Mohammad Monir Hossen",
    designation: "ইবতেদায়ী মৌলভী",
    degree: "কামিল (হাদিস), বি.এ. অনার্স (ইসলামিক স্টাডিজ)",
    joining_date: "2025-09-01",
    index_number: null,
    email: "mmhossen2001@gmail.com",
    nid_number: "1964621617",
    contact_number: "01839583672",
    type: "teacher",
  },
  {
    full_name_bn: "মোহাম্মদ আমিরুল ইসলাম",
    full_name_en: "Mohammad Amirul Islam",
    designation: "ইবি প্রধান",
    degree: "কামিল (হাদিস-২য় বিভাগ), ফাজিল (হাদিস-২য়)",
    joining_date: "2002-09-22",
    index_number: "5827",
    email: null,
    nid_number: "4180211833",
    contact_number: "01726494667",
    type: "teacher",
  },
  {
    full_name_bn: "মোহাম্মদ আবদুল করিম",
    full_name_en: "Mohammad Abdul Karim",
    designation: "ইবতেদায়ি ক্বারি",
    degree: "কামিল (হাদিস-২য়), ফাজিল (৩য়)",
    joining_date: "2000-05-16",
    index_number: "0005819",
    email: null,
    nid_number: "1510811404956",
    contact_number: "01837278339",
    type: "teacher",
  },
  {
    full_name_bn: "মুহাম্মদ ইকবাল হোসাইন",
    full_name_en: "Muhammad Iqbal Hossain",
    designation: "সহকারী শিক্ষক",
    degree: "কামিল (হাদিস, ফিকহ)",
    joining_date: "2016-01-02",
    index_number: null,
    email: "iqbalhossain19890@gmail.com",
    nid_number: "19931591906000297",
    contact_number: "01518463832",
    type: "teacher",
  },
  {
    full_name_bn: "মো: আবদুল হালিম",
    full_name_en: "Md. Abdul Halim",
    designation: "সহকারী মৌলবি",
    degree: "কামিল (হাদিস)",
    joining_date: "2025-09-01",
    index_number: null,
    email: "mdabdulhalimctg105@gmail.com",
    nid_number: "2802862157",
    contact_number: "01816921260",
    type: "teacher",
  },
  {
    full_name_bn: "তাসনুভা ইসলাম",
    full_name_en: "Tasnuva Islam",
    designation: "সহকারী শিক্ষক",
    degree: "M.S.C (Botany)",
    joining_date: "2023-09-27",
    index_number: "M0050073",
    email: null,
    nid_number: "3293901462",
    contact_number: "01791405089",
    type: "teacher",
  },
  {
    full_name_bn: "মুহাম্মদ শওকত আলী",
    full_name_en: "Muhammad Shawkat Ali",
    designation: "সহকারী মৌলভী",
    degree: "কামিল (হাদিস) ১ম শ্রেণি",
    joining_date: "2025-09-01",
    index_number: null,
    email: "alis97773@gmail.com",
    nid_number: "19921520801000029",
    contact_number: "01815849560",
    type: "teacher",
  },
  {
    full_name_bn: "রমিজ উদ্দিন",
    full_name_en: "Ramiz Uddin",
    designation: "সহকারী শিক্ষক (গ্রন্থাগার ও তথ্য বিজ্ঞান)",
    degree: "কামিল (হাদিস শরীফ) ১ম শ্রেণী",
    joining_date: "2025-09-01",
    index_number: null,
    email: null,
    nid_number: "1503354761",
    contact_number: "01814307220",
    type: "teacher",
  },
  {
    full_name_bn: "ইসরাত শারমিন চৌধুরী",
    full_name_en: "Israth Sarmin Chowdhury",
    designation: "সহকারী শিক্ষক",
    degree: "B.A (Hons)",
    joining_date: "2023-09-27",
    index_number: "M0046966",
    email: "israthsarmin3@gmail.com",
    nid_number: "01891593526070139",
    contact_number: "01537255284",
    type: "teacher",
  },
  {
    full_name_bn: "আরমান শাহ সিদ্দিকী",
    full_name_en: "Arman Shah Siddiquee",
    designation: "ইবতেদায়ি শিক্ষক",
    degree: "H.S.C. (এইচ.এস.সি.)",
    joining_date: "2025-09-01",
    index_number: null,
    email: "armanwardi123@gmail.com",
    nid_number: "3314482963",
    contact_number: "01402453722",
    type: "teacher",
  },
  {
    full_name_bn: "মুহাম্মদ মুফিজুর রহমান",
    full_name_en: "Muhammad Mofizur Rahman",
    designation: "উপাধ্যক্ষ",
    degree: "কামিল (হাদিস), এম.এ (ইসলামিক স্টাডিজ)",
    joining_date: "2000-04-01",
    index_number: "5825",
    email: null,
    nid_number: "5080199960",
    contact_number: "01812471040",
    type: "teacher",
  },
  {
    full_name_bn: "মুহাম্মদ আবু তৈয়ব",
    full_name_en: "Muhammad Abu Taiyeb",
    designation: "সহকারী মৌলভী",
    degree: "কামিল (হাদিস, ফিকাহ)",
    joining_date: "2003-09-28",
    index_number: "5822",
    email: null,
    nid_number: "1591018075096",
    contact_number: "01815864355",
    type: "teacher",
  },
  {
    full_name_bn: "ফারজানা আকতার ববি",
    full_name_en: "Farjana Akter Boby",
    designation: "সহকারী শিক্ষক",
    degree: "স্নাতকোত্তর",
    joining_date: "2025-08-03",
    index_number: null,
    email: "farjoboby@gmail.com",
    nid_number: "6906563546",
    contact_number: "01827236989",
    type: "teacher",
  },
  {
    full_name_bn: "মো. মনিরুল হাসান",
    full_name_en: "Md. Monirul Hasan",
    designation: "সহকারী শিক্ষক (সামাজিক বিজ্ঞান)",
    degree: "Master’s of Social Science (Sociology), B.Ed",
    joining_date: "2014-09-14",
    index_number: "M0005816",
    email: "mdmonirulhasan2018@gmail.com",
    nid_number: "1511828331145",
    contact_number: "01860525494",
    type: "teacher",
  },
  {
    full_name_bn: "মোহাম্মদ গোলাম মোস্তফা",
    full_name_en: "Mohammad Golam Mostafa",
    designation: "জুনিয়র মৌলভী",
    degree: "কামিল (হাদিস)",
    joining_date: "2007-06-16",
    index_number: "0005829",
    email: null,
    nid_number: null,
    contact_number: "01818176940",
    type: "teacher",
  },
  {
    full_name_bn: "মোহাম্মদ আবুল হোসেন",
    full_name_en: "Mohammad Abul Hossain",
    designation: "সহকারী মৌলভী",
    degree: "কামিল (হাদিস)",
    joining_date: "2000-05-16",
    index_number: "5821",
    email: null,
    nid_number: "3293973248",
    contact_number: "01812572706",
    type: "teacher",
  },
  {
    full_name_bn: "মো. আবদুল বারী",
    full_name_en: "Md Abdul Bari",
    designation: "সহকারী শিক্ষক (আরবি)",
    degree: "Kamil (M.A) (Kushtia University)",
    joining_date: "2014-03-06",
    index_number: null,
    email: "mdabdulbari223344@gmail.com",
    nid_number: "8231271143",
    contact_number: "01814471808",
    type: "teacher",
  },
  {
    full_name_bn: "সিমোন আরা বেগম",
    full_name_en: "Semon Ara Begum",
    designation: "সহকারী শিক্ষক",
    degree: "B.A",
    joining_date: "2008-08-02",
    index_number: null,
    email: "semonarabegum05@gmail.com",
    nid_number: "1015729526",
    contact_number: "01863596827",
    type: "teacher",
  },
];

async function insertTeachers() {
  console.log(`Starting insertion of ${teachersData.length} teachers...`);

  // Default password hash for staff accounts with emails
  const defaultPasswordHash = await bcrypt.hash("Wasia@2026#Teacher", 10);

  const prefix = "EMP";
  const numDigits = 3;
  let counter = 1;

  // Check if any existing employee IDs exist
  const { data: existingStaff } = await supabase
    .from("staffs")
    .select("employee_id")
    .not("employee_id", "is", null);

  let highestNum = 0;
  if (existingStaff && existingStaff.length > 0) {
    for (const s of existingStaff) {
      if (!s.employee_id) continue;
      const numPart = s.employee_id.replace(/\D/g, "");
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > highestNum) {
        highestNum = parsed;
      }
    }
  }
  counter = highestNum + 1;

  const results = [];

  for (const t of teachersData) {
    const padded = String(counter).padStart(numDigits, "0");
    const employeeId = `${prefix}${padded}`;
    counter += 1;

    console.log(`\nInserting: ${t.full_name_bn} (${t.full_name_en}) - ${employeeId}`);

    // 1. Insert into staffs table
    const staffPayload = {
      full_name_bn: t.full_name_bn,
      full_name_en: t.full_name_en,
      designation: t.designation,
      type: t.type,
      joining_date: t.joining_date,
      employee_id: employeeId,
      nid_number: t.nid_number,
      contact_number: t.contact_number,
      email: t.email,
      status: "active",
    };

    const { data: staffData, error: staffError } = await supabase
      .from("staffs")
      .insert([staffPayload])
      .select()
      .single();

    if (staffError) {
      console.error(`❌ Error inserting staff ${t.full_name_en}:`, staffError.message);
      continue;
    }

    const staffId = staffData.id;

    // 2. Insert into staff_academics
    if (t.degree) {
      const { error: academicError } = await supabase
        .from("staff_academics")
        .insert([
          {
            staff_id: staffId,
            degree: t.degree,
          },
        ]);
      if (academicError) {
        console.warn(`  ⚠️ Academic record error for ${t.full_name_en}:`, academicError.message);
      }
    }

    // 3. Insert into staff_government_info
    const { error: govError } = await supabase
      .from("staff_government_info")
      .insert([
        {
          staff_id: staffId,
          index_number: t.index_number,
          first_joining_date: t.joining_date,
        },
      ]);
    if (govError) {
      console.warn(`  ⚠️ Government info error for ${t.full_name_en}:`, govError.message);
    }

    // 4. Insert into staff_accounts if email exists
    if (t.email) {
      const { error: accountError } = await supabase
        .from("staff_accounts")
        .upsert(
          [
            {
              staff_id: staffId,
              email: t.email.toLowerCase(),
              password_hash: defaultPasswordHash,
              role: "teacher",
              status: "active",
            },
          ],
          { onConflict: "staff_id" }
        );
      if (accountError) {
        console.warn(`  ⚠️ Account creation error for ${t.full_name_en}:`, accountError.message);
      }
    }

    results.push({
      id: staffId,
      employee_id: employeeId,
      name_bn: t.full_name_bn,
      name_en: t.full_name_en,
      designation: t.designation,
      index_no: t.index_number || "-",
      email: t.email || "-",
      phone: t.contact_number,
      nid: t.nid_number || "-",
      joining: t.joining_date,
    });
  }

  console.log("\n==========================================");
  console.log(`🎉 Successfully processed ${results.length} teachers!`);
  console.log("==========================================");
  console.table(results);
}

insertTeachers().catch(console.error);
