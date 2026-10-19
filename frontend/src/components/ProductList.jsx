import { BookOpen, CalendarDays, Eye, Pencil, Trash2, UserRound } from "lucide-react";
import { getJournalCategoryLabel } from "../constants/journalCategories.js";

const categoryCoverClass = {
  วิชาการ: "journal-cover--academic",
  วิจัย: "journal-cover--research",
  ทั่วไป: "journal-cover--general",
};

const formatJournalDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ProductList = ({ journals, latestJournalId, hasFilters, onView, onEdit, onDelete }) => {
  if (journals.length === 0) {
    return (
      <div className="journal-empty-state">
        <div className="journal-empty-mark" aria-hidden="true">J</div>
        <div className="text-center">
          <h2 className="card-title mt-2">
            {hasFilters ? "ไม่พบวารสารที่ตรงกับเงื่อนไข" : "ยังไม่มีข้อมูลวารสาร"}
          </h2>
          <p className="text-sm text-base-content/60">
            {hasFilters ? "ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่" : "เริ่มต้นด้วยการเพิ่มวารสารใหม่"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <section>
      <div className="journal-results-heading mb-4 flex items-center justify-between">
        <div>
          <h2>วารสารทั้งหมด</h2>
          <p className="text-sm text-base-content/60">
            มีวารสาร {journals.length} รายการ
          </p>
        </div>
        <span className="badge badge-primary badge-lg">{journals.length}</span>
      </div>
      <div className="journal-card-grid">
        {journals.map((journal) => (
          <article className="journal-card" key={journal.id}>
            <div
              className={`journal-cover ${categoryCoverClass[journal.category] ?? "journal-cover--academic"}`}
              aria-hidden="true"
            >
              <BookOpen className="journal-cover-icon" />
              <span className="journal-cover-rule" />
              <span className="journal-cover-label">JOURNAL / {journal.category}</span>
              <span className="journal-cover-number">
                {String(journal.id).padStart(2, "0")}
              </span>
            </div>
            <div className="journal-card-content">
              <div className="journal-card-topline">
                <span className="journal-card-index">
                  JOURNAL {String(journal.id).padStart(3, "0")}
                </span>
                {journal.id === latestJournalId && (
                  <span className="journal-latest-badge">เพิ่มล่าสุด</span>
                )}
                <span
                  className={`badge ${journal.status ? "badge-success" : "badge-ghost"}`}
                >
                  {journal.status ? "เผยแพร่" : "ฉบับร่าง"}
                </span>
              </div>
              <h3 className="journal-card-title">{journal.title}</h3>
              <p className="journal-card-meta">
                <UserRound aria-hidden="true" />
                <span>{journal.responsible}</span>
              </p>
              <p className="journal-card-meta">
                <CalendarDays aria-hidden="true" />
                <span>{formatJournalDate(journal.date)}</span>
              </p>
              <div className="journal-card-footer">
                <span className="journal-card-category">
                  {getJournalCategoryLabel(journal.category)}
                </span>
                <div className="journal-card-actions">
                  <button
                    className="journal-icon-action"
                    onClick={() => onView(journal)}
                    aria-label={`ดูรายละเอียดวารสาร ${journal.title}`}
                    title="ดูรายละเอียด"
                  >
                    <Eye />
                  </button>
                  <button
                    className="journal-icon-action"
                    onClick={() => onEdit(journal)}
                    aria-label={`แก้ไขวารสาร ${journal.title}`}
                    title="แก้ไข"
                  >
                    <Pencil />
                  </button>
                  <button
                    className="journal-icon-action journal-icon-action--delete"
                    onClick={() => onDelete(journal.id)}
                    aria-label={`ลบวารสาร ${journal.title}`}
                    title="ลบ"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
