import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageState from "../components/PageState.jsx";
import ProductForm from "../components/ProductForm.jsx";
import ProductHeader from "../components/ProductHeader.jsx";
import { showError, showSuccess } from "../services/alertService.js";
import {
  createJournal,
  getJournal,
  updateJournal,
} from "../services/productService.js";

function ProductFormPage({ isEditing = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [responsible, setResponsible] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const loadJournal = async () => {
      try {
        const journal = await getJournal(id);
        setTitle(journal.title);
        setResponsible(journal.responsible);
        setCategory(journal.category);
        setDate(journal.date);
        setDescription(journal.description ?? "");
        setStatus(journal.status);
      } catch (requestError) {
        setError(requestError.message);
        showError(requestError);
      } finally {
        setLoading(false);
      }
    };

    loadJournal();
  }, [id, isEditing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !title.trim() ||
      title.trim().length > 150 ||
      !responsible.trim() ||
      responsible.trim().length > 100 ||
      !category ||
      !date ||
      description.trim().length > 2000
    ) {
      showError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      const journal = {
        title: title.trim(),
        responsible: responsible.trim(),
        category,
        date,
        description: description.trim() || null,
        status,
      };
      let latestJournalId;
      if (isEditing) {
        await updateJournal(id, journal);
      } else {
        const createdJournal = await createJournal(journal);
        latestJournalId = createdJournal.id;
      }
      await showSuccess(isEditing ? "แก้ไขวารสารสำเร็จ" : "เพิ่มวารสารสำเร็จ");
      navigate("/journals", {
        state: latestJournalId ? { latestJournalId } : null,
      });
    } catch (requestError) {
      showError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="journal-subpage min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="journals-shell mx-auto max-w-6xl space-y-6">
        <ProductHeader />
        <PageState loading={loading} error={error} />
        {!loading && !error && (
          <ProductForm
            editingId={isEditing ? id : null}
            title={title}
            responsible={responsible}
            category={category}
            date={date}
            description={description}
            status={status}
            isSubmitting={isSubmitting}
            onTitleChange={setTitle}
            onResponsibleChange={setResponsible}
            onCategoryChange={setCategory}
            onDateChange={setDate}
            onDescriptionChange={setDescription}
            onStatusChange={setStatus}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/journals")}
          />
        )}
      </div>
    </main>
  );
}

export default ProductFormPage;
