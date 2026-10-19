import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import PageState from "../components/PageState.jsx";
import ProductHeader from "../components/ProductHeader.jsx";
import { getJournalCategoryLabel } from "../constants/journalCategories.js";
import { getJournal } from "../services/productService.js";

const formatTimestamp = (value) =>
  value ? new Date(value).toLocaleString("th-TH") : "-";

function JournalDetailPage() {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;
    const loadJournal = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getJournal(id);
        if (isCurrentRequest) setJournal(result);
      } catch (requestError) {
        if (isCurrentRequest) {
          setJournal(null);
          setError(
            requestError.status === 404
              ? "ไม่พบวารสารที่ต้องการ"
              : requestError.message,
          );
        }
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };
    loadJournal();
    return () => {
      isCurrentRequest = false;
    };
  }, [id]);

  return (
    <main className="journal-subpage min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="journals-shell mx-auto max-w-6xl space-y-6">
        <ProductHeader />
        <div className="flex flex-wrap justify-between gap-3">
          <Link className="btn btn-ghost" to="/journals">
            <ArrowLeft className="size-4" /> กลับหน้ารายการ
          </Link>
          {journal && (
            <Link className="btn btn-primary" to={`/journals/${journal.id}/edit`}>
              <Pencil className="size-4" /> แก้ไขวารสาร
            </Link>
          )}
        </div>
        <PageState loading={loading} error={error} />
        {!loading && journal && (
          <section className="journal-detail-panel overflow-hidden">
            <div className="journal-detail-titlebar p-5 sm:p-7">
              <p className="font-mono text-sm text-base-content/55">
                วารสาร #{journal.id}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{journal.title}</h2>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
              <div>
                <dt className="text-sm text-base-content/60">ผู้รับผิดชอบ</dt>
                <dd className="mt-1 font-medium">{journal.responsible}</dd>
              </div>
              <div>
                <dt className="text-sm text-base-content/60">หมวดหมู่</dt>
                <dd className="mt-1 font-medium">
                  {getJournalCategoryLabel(journal.category)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-base-content/60">วันที่</dt>
                <dd className="mt-1 font-medium">{journal.date}</dd>
              </div>
              <div>
                <dt className="text-sm text-base-content/60">สถานะ</dt>
                <dd className="mt-1">
                  <span
                    className={`badge ${journal.status ? "badge-success" : "badge-ghost"}`}
                  >
                    {journal.status ? "เผยแพร่" : "ฉบับร่าง"}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-base-content/60">คำอธิบาย</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {journal.description || "ไม่มีคำอธิบาย"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-base-content/60">สร้างเมื่อ</dt>
                <dd className="mt-1">{formatTimestamp(journal.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-base-content/60">แก้ไขล่าสุด</dt>
                <dd className="mt-1">{formatTimestamp(journal.updatedAt)}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}

export default JournalDetailPage;