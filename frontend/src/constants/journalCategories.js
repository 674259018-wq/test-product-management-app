const journalCategories = [
  { value: "วิชาการ", label: "วิชาการ" },
  { value: "วิจัย", label: "วิจัย" },
  { value: "ทั่วไป", label: "ทั่วไป" },
];

const categoryLabels = new Map([
  ["A", "เทคโนโลยี, วิทยาศาสตร์, วรรณกรรม"],
  ["B", "การศึกษา, เทคโนโลยี, สังคม"],
  ["C", "วิชาการ, วิจัย, ทั่วไป"],
  ["D", "อบรม, สัมมนา, จิตอาสา"],
  ["E", "บทความ, วิดีโอ, แบบฝึกหัด"],
  ["วิชาการ", "วิชาการ"],
  ["วิจัย", "วิจัย"],
  ["ทั่วไป", "ทั่วไป"],
]);

const getJournalCategoryLabel = (category) =>
  categoryLabels.get(category) ?? category;

export { getJournalCategoryLabel, journalCategories };
