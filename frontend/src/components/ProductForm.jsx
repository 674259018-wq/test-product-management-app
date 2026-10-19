import { Pencil, PlusCircle, X } from "lucide-react";
import { journalCategories } from "../constants/journalCategories.js";

function ProductForm({
  editingId,
  title,
  responsible,
  category,
  date,
  description,
  status,
  isSubmitting,
  onTitleChange,
  onResponsibleChange,
  onCategoryChange,
  onDateChange,
  onDescriptionChange,
  onStatusChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="journal-form-card card">
      <div className="card-body p-5 sm:p-6">
        <div className="journal-form-heading mb-2 flex items-center gap-3">
          <div className="journal-form-heading-icon">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <h2 className="card-title text-xl">
              {editingId ? "แก้ไขวารสาร" : "เพิ่มวารสาร"}
            </h2>
            <p className="text-sm text-base-content/60">
              {editingId
                ? "แก้ไขข้อมูลวารสารในระบบ"
                : "กรอกข้อมูลวารสารเพื่อเพิ่มเข้าสู่ระบบ"}
            </p>
          </div>
        </div>
        <form
          className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={onSubmit}
        >
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">ชื่อวารสาร</span>
            <input
              className="input input-bordered w-full"
              type="text"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="เช่น วารสารวิทยาศาสตร์"
              maxLength={150}
              required
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">ผู้รับผิดชอบ</span>
            <input
              className="input input-bordered w-full"
              type="text"
              value={responsible}
              onChange={(event) => onResponsibleChange(event.target.value)}
              placeholder="ชื่อผู้รับผิดชอบ"
              maxLength={100}
              required
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">หมวดหมู่</span>
            <select
              className="select select-bordered w-full"
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              required
            >
              <option value="" disabled>
                เลือกหมวดหมู่
              </option>
              {journalCategories.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">วันที่</span>
            <input
              className="input input-bordered w-full"
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              required
            />
          </label>
          <label className="form-control w-full md:col-span-2">
            <span className="label-text mb-2 font-medium">คำอธิบาย (ไม่บังคับ)</span>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="รายละเอียดวารสาร สูงสุด 2,000 ตัวอักษร"
              maxLength={2000}
              rows={4}
            />
            <span className="mt-1 text-right text-xs text-base-content/60">
              {description.length}/2000
            </span>
          </label>
          <label className="label cursor-pointer justify-start gap-3 md:col-span-2">
            <input
              className="toggle toggle-primary"
              type="checkbox"
              checked={status}
              onChange={(event) => onStatusChange(event.target.checked)}
            />
            <span className="label-text">
              {status ? "เผยแพร่" : "ฉบับร่าง"}
            </span>
          </label>
          <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:justify-end">
            <button
              className="btn journal-primary-action w-full md:w-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : editingId ? (
                <Pencil className="size-4" />
              ) : (
                <PlusCircle className="size-4" />
              )}
              {isSubmitting
                ? "กำลังบันทึก..."
                : editingId
                  ? "บันทึกการแก้ไข"
                  : "บันทึกข้อมูล"}
            </button>
            <button
              className="btn journal-secondary-action w-full md:w-auto"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="size-4" /> ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ProductForm;
