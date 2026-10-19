import { useState, useEffect } from "react";
import { BadgeCheck, BookOpen, Clock3, Layers3, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import PageState from "../components/PageState";
import ProductHeader from "../components/ProductHeader";
import ProductList from "../components/ProductList";
import { journalCategories } from "../constants/journalCategories.js";
import { deleteJournal, getJournals } from "../services/productService";
import {
  confirmDelete,
  showError,
  showSuccess,
} from "../services/alertService";
const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const latestJournalId = location.state?.latestJournalId;
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [filters, setFilters] = useState({ search: "", category: "" });
  useEffect(() => {
    let isCurrentRequest = true;
    const loadingJournals = async () => {
      setLoading(true);
      setError("");
      try {
        const results = await getJournals(filters);
        if (isCurrentRequest) {
          const orderedResults = [...results].sort((first, second) => {
            if (first.id === latestJournalId) return -1;
            if (second.id === latestJournalId) return 1;
            return 0;
          });
          setJournals(orderedResults);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setJournals([]);
          setError(error.message);
        }
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };
    loadingJournals();
    return () => {
      isCurrentRequest = false;
    };
  }, [filters, latestJournalId]);

  const handleSearch = (event) => {
    event.preventDefault();
    setFilters({ search: searchInput.trim(), category: categoryInput });
  };

  const clearFilters = () => {
    setSearchInput("");
    setCategoryInput("");
    setFilters({ search: "", category: "" });
  };

  const publishedCount = journals.filter((journal) => journal.status).length;
  const draftCount = journals.length - publishedCount;

  const handleDelete = async (id) => {
    if (!(await confirmDelete())) return;
    try {
      await deleteJournal(id);
      setJournals((currentJournals) =>
        currentJournals.filter((journal) => journal.id !== id),
      );
      await showSuccess("ลบวารสารสำเร็จ");
    } catch (error) {
      showError(error);
    }
  };
  return (
    <main className="portal-page min-h-screen">
        <ProductHeader />
        <div className="portal-content">
        <form
          className="portal-search-form flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSearch}
        >
          <label className="portal-search input flex flex-1 items-center gap-3">
            <Search className="size-5" aria-hidden="true" />
            <input
              type="search"
              className="grow"
              placeholder="ค้นหาชื่อวารสารหรือผู้รับผิดชอบ"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>
          <select
            className="select portal-category-filter sm:w-52"
            value={categoryInput}
            onChange={(event) => {
              const category = event.target.value;
              setCategoryInput(category);
              setFilters({ search: searchInput.trim(), category });
            }}
            aria-label="กรองตามหมวดหมู่"
          >
            <option value="">ทุกหมวดหมู่</option>
            {journalCategories.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="btn portal-search-button" type="submit" aria-label="ค้นหา">
            <Search className="size-4" />
          </button>
          <button
            className="btn portal-clear-button"
            type="button"
            onClick={clearFilters}
            aria-label="ล้างตัวกรอง"
            title="ล้างตัวกรอง"
          >
            <X className="size-4" />
          </button>
        </form>
        <section className="portal-stat-grid" aria-label="สถิติวารสาร">
          <article className="portal-stat">
            <BookOpen aria-hidden="true" />
            <strong>{journals.length.toLocaleString("th-TH")}</strong>
            <span>วารสารในรายการ</span>
          </article>
          <article className="portal-stat">
            <BadgeCheck aria-hidden="true" />
            <strong>{publishedCount.toLocaleString("th-TH")}</strong>
            <span>เผยแพร่</span>
          </article>
          <article className="portal-stat">
            <Clock3 aria-hidden="true" />
            <strong>{draftCount.toLocaleString("th-TH")}</strong>
            <span>ฉบับร่าง</span>
          </article>
          <article className="portal-stat">
            <Layers3 aria-hidden="true" />
            <strong>{journalCategories.length.toLocaleString("th-TH")}</strong>
            <span>หมวดหมู่</span>
          </article>
        </section>
        <div className="portal-catalog-heading">
          <div>
            <span className="portal-section-kicker">CATALOG / JOURNALS</span>
            <h2>รายการวารสาร</h2>
          </div>
          <span className="portal-catalog-caption">ค้นหาและจัดการรายการในระบบ</span>
        </div>
        <PageState loading={loading} error={error} />
        {!loading && !error && (
          <ProductList
            journals={journals}
            latestJournalId={latestJournalId}
            hasFilters={Boolean(filters.search || filters.category)}
            onView={(journal) => navigate(`/journals/${journal.id}`)}
            onEdit={(journal) => navigate(`/journals/${journal.id}/edit`)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
};

export default ProductPage;
