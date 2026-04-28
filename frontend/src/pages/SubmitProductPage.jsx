import { forwardRef, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Container from "../components/layout/Container";
import Seo from "../components/ui/Seo";
import useCategories from "../hooks/useCategories";
import useTags from "../hooks/useTags";
import api from "../api/client";

const inputClasses =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors";

const PRICING_TYPES = ["free", "freemium", "paid", "contact_for_pricing"];
const LINK_TYPES = ["website", "demo", "documentation", "video", "github"];
const CONTACT_TYPES = ["email", "phone", "facebook", "linkedin", "other"];

function emptyImage() {
  return { file: null };
}
function emptyLink() {
  return { label_en: "", label_bg: "", url: "", link_type: "website" };
}
function emptyContact() {
  return { contact_type: "email", value: "", label_en: "", label_bg: "" };
}

function initialForm() {
  return {
    submitter_email: "",
    product_name: "",
    tagline_en: "",
    tagline_bg: "",
    description_en: "",
    description_bg: "",
    logo: null,
    website_url: "",
    pricing_type: "free",
    pricing_details_en: "",
    pricing_details_bg: "",
    suggested_category: "",
    suggested_tags: [],
    images: [],
    links: [],
    contacts: [],
  };
}

export default function SubmitProductPage() {
  const { token } = useParams();
  const { t } = useLanguage();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const tagsRef = useRef(null);

  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get(`/submit/${token}/validate/`)
      .then(() => {
        if (active) setValid(true);
      })
      .catch(() => {
        if (active) setValid(false);
      })
      .finally(() => {
        if (active) setValidating(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  function handleField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function updateRow(section, idx, patch) {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].map((row, i) => (i === idx ? { ...row, ...patch } : row)),
    }));
  }

  function addRow(section, factory) {
    setForm((prev) => ({ ...prev, [section]: [...prev[section], factory()] }));
  }

  function removeRow(section, idx) {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== idx),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    setFieldErrors({});

    if (form.suggested_tags.length === 0) {
      setFieldErrors({ suggested_tags: [t("submitProduct.tagsRequired")] });
      setSubmitting(false);
      tagsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("submitter_email", form.submitter_email);
      fd.append("product_name", form.product_name);
      fd.append("tagline_en", form.tagline_en);
      fd.append("tagline_bg", form.tagline_bg);
      fd.append("description_en", form.description_en);
      fd.append("description_bg", form.description_bg);
      fd.append("website_url", form.website_url);
      fd.append("pricing_type", form.pricing_type);
      fd.append("pricing_details_en", form.pricing_details_en);
      fd.append("pricing_details_bg", form.pricing_details_bg);
      if (form.suggested_category) {
        fd.append("suggested_category", form.suggested_category);
      }
      form.suggested_tags.forEach((id) => fd.append("suggested_tags", id));
      if (form.logo) {
        fd.append("logo", form.logo);
      }

      form.images.forEach((row, i) => {
        if (row.file) fd.append(`images[${i}].image`, row.file);
      });
      form.links.forEach((row, i) => {
        fd.append(`links[${i}].url`, row.url);
        fd.append(`links[${i}].link_type`, row.link_type);
        fd.append(`links[${i}].label_en`, row.label_en);
        fd.append(`links[${i}].label_bg`, row.label_bg);
      });
      form.contacts.forEach((row, i) => {
        fd.append(`contacts[${i}].contact_type`, row.contact_type);
        fd.append(`contacts[${i}].value`, row.value);
        fd.append(`contacts[${i}].label_en`, row.label_en);
        fd.append(`contacts[${i}].label_bg`, row.label_bg);
      });

      await api.post(`/submit/${token}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 410) {
        setValid(false);
      } else if (err.response?.status === 400 && err.response?.data) {
        setFieldErrors(err.response.data);
      }
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (validating) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500">{t("submitProduct.loading")}</p>
      </Container>
    );
  }

  if (!valid) {
    return (
      <>
        <Seo title={t("submitProduct.seoTitle")} description={t("submitProduct.subtitle")} />
        <Container className="py-20 max-w-xl text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
            <i className="fas fa-circle-xmark text-2xl text-red-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("submitProduct.invalidTitle")}
          </h1>
          <p className="mt-3 text-gray-600">{t("submitProduct.invalidText")}</p>
        </Container>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Seo title={t("submitProduct.seoTitle")} description={t("submitProduct.subtitle")} />
        <Container className="py-20 max-w-xl text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fas fa-check text-2xl text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("submitProduct.successTitle")}
          </h1>
          <p className="mt-3 text-gray-600">{t("submitProduct.successText")}</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Seo title={t("submitProduct.seoTitle")} description={t("submitProduct.subtitle")} />
      <Container className="py-10 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {t("submitProduct.title")}
        </h1>
        <p className="mt-2 text-gray-600">{t("submitProduct.subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          {/* Submitter email */}
          <Section title={t("submitProduct.basicSection")}>
            <Field
              label={t("submitProduct.submitterEmailLabel")}
              required
              error={fieldErrors.submitter_email}
            >
              <input
                type="email"
                required
                value={form.submitter_email}
                onChange={(e) => handleField("submitter_email", e.target.value)}
                placeholder={t("submitProduct.submitterEmailPlaceholder")}
                className={inputClasses}
              />
            </Field>

            <Field
              label={t("submitProduct.nameLabel")}
              required
              error={fieldErrors.product_name}
            >
              <input
                type="text"
                required
                value={form.product_name}
                onChange={(e) => handleField("product_name", e.target.value)}
                className={inputClasses}
              />
            </Field>

            <BilingualField
              label={t("submitProduct.taglineLabel")}
              hint={t("submitProduct.taglineHelp")}
              required
              t={t}
              valueEn={form.tagline_en}
              valueBg={form.tagline_bg}
              onChangeEn={(v) => handleField("tagline_en", v)}
              onChangeBg={(v) => handleField("tagline_bg", v)}
              errorEn={fieldErrors.tagline_en}
              errorBg={fieldErrors.tagline_bg}
            />

            <BilingualField
              label={t("submitProduct.descriptionLabel")}
              required
              t={t}
              valueEn={form.description_en}
              valueBg={form.description_bg}
              onChangeEn={(v) => handleField("description_en", v)}
              onChangeBg={(v) => handleField("description_bg", v)}
              errorEn={fieldErrors.description_en}
              errorBg={fieldErrors.description_bg}
              textarea
            />

            <Field
              label={t("submitProduct.websiteLabel")}
              required
              error={fieldErrors.website_url}
            >
              <input
                type="url"
                required
                value={form.website_url}
                onChange={(e) => handleField("website_url", e.target.value)}
                placeholder={t("submitProduct.websitePlaceholder")}
                className={inputClasses}
              />
            </Field>

            <Field
              label={t("submitProduct.categoryLabel")}
              hint={t("submitProduct.categoryHelp")}
              required
              error={fieldErrors.suggested_category}
            >
              <select
                required
                value={form.suggested_category}
                onChange={(e) => handleField("suggested_category", e.target.value)}
                className={inputClasses}
              >
                <option value="">{t("submitProduct.categoryPlaceholder")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label={t("submitProduct.tagsLabel")}
              hint={t("submitProduct.tagsHelp")}
              required
              error={fieldErrors.suggested_tags}
              ref={tagsRef}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-1">
                {tags.map((tag) => {
                  const checked = form.suggested_tags.includes(tag.id);
                  return (
                    <label
                      key={tag.id}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          handleField(
                            "suggested_tags",
                            checked
                              ? form.suggested_tags.filter((id) => id !== tag.id)
                              : [...form.suggested_tags, tag.id],
                          );
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      {tag.name}
                    </label>
                  );
                })}
              </div>
            </Field>
          </Section>

          {/* Logo */}
          <Section title={t("submitProduct.logoSection")}>
            <Field
              label={t("submitProduct.logoLabel")}
              hint={t("submitProduct.logoHelp")}
              required
              error={fieldErrors.logo}
            >
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => handleField("logo", e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100"
              />
            </Field>
          </Section>

          {/* Pricing */}
          <Section title={t("submitProduct.pricingSection")}>
            <Field
              label={t("submitProduct.pricingTypeLabel")}
              required
              error={fieldErrors.pricing_type}
            >
              <select
                value={form.pricing_type}
                onChange={(e) => handleField("pricing_type", e.target.value)}
                className={inputClasses}
              >
                {PRICING_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {t(`pricing.${pt}`)}
                  </option>
                ))}
              </select>
            </Field>

            <BilingualField
              label={t("submitProduct.pricingDetailsLabel")}
              hint={t("submitProduct.pricingDetailsHelp")}
              t={t}
              valueEn={form.pricing_details_en}
              valueBg={form.pricing_details_bg}
              onChangeEn={(v) => handleField("pricing_details_en", v)}
              onChangeBg={(v) => handleField("pricing_details_bg", v)}
              errorEn={fieldErrors.pricing_details_en}
              errorBg={fieldErrors.pricing_details_bg}
              textarea
            />
          </Section>

          {/* Images */}
          <Section
            title={t("submitProduct.imagesSection")}
            help={t("submitProduct.imagesHelp")}
          >
            {form.images.map((row, i) => (
              <RowCard
                key={i}
                onRemove={() => removeRow("images", i)}
                removeLabel={t("submitProduct.remove")}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateRow("images", i, { file: e.target.files?.[0] || null })
                  }
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100"
                />
              </RowCard>
            ))}
            <AddButton
              label={t("submitProduct.addImage")}
              onClick={() => addRow("images", emptyImage)}
            />
          </Section>

          {/* Links */}
          <Section
            title={t("submitProduct.linksSection")}
            help={t("submitProduct.linksHelp")}
          >
            {form.links.map((row, i) => (
              <RowCard
                key={i}
                onRemove={() => removeRow("links", i)}
                removeLabel={t("submitProduct.remove")}
              >
                <Field label={t("submitProduct.linkType")}>
                  <select
                    value={row.link_type}
                    onChange={(e) => updateRow("links", i, { link_type: e.target.value })}
                    className={inputClasses}
                  >
                    {LINK_TYPES.map((lt) => (
                      <option key={lt} value={lt}>
                        {t(`linkType.${lt}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("submitProduct.linkUrlLabel")} required>
                  <input
                    type="url"
                    required
                    value={row.url}
                    onChange={(e) => updateRow("links", i, { url: e.target.value })}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label={`${t("submitProduct.linkLabelLabel")} (${t("submitProduct.en")})`}>
                    <input
                      type="text"
                      value={row.label_en}
                      onChange={(e) => updateRow("links", i, { label_en: e.target.value })}
                      className={inputClasses}
                    />
                  </Field>
                  <Field label={`${t("submitProduct.linkLabelLabel")} (${t("submitProduct.bg")})`}>
                    <input
                      type="text"
                      value={row.label_bg}
                      onChange={(e) => updateRow("links", i, { label_bg: e.target.value })}
                      className={inputClasses}
                    />
                  </Field>
                </div>
              </RowCard>
            ))}
            <AddButton
              label={t("submitProduct.addLink")}
              onClick={() => addRow("links", emptyLink)}
            />
          </Section>

          {/* Contacts */}
          <Section
            title={t("submitProduct.contactsSection")}
            help={t("submitProduct.contactsHelp")}
          >
            {form.contacts.map((row, i) => (
              <RowCard
                key={i}
                onRemove={() => removeRow("contacts", i)}
                removeLabel={t("submitProduct.remove")}
              >
                <Field label={t("submitProduct.contactType")}>
                  <select
                    value={row.contact_type}
                    onChange={(e) => updateRow("contacts", i, { contact_type: e.target.value })}
                    className={inputClasses}
                  >
                    {CONTACT_TYPES.map((ct) => (
                      <option key={ct} value={ct}>
                        {t(`contactType.${ct}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("submitProduct.contactValueLabel")} required>
                  <input
                    type="text"
                    required
                    value={row.value}
                    onChange={(e) => updateRow("contacts", i, { value: e.target.value })}
                    className={inputClasses}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label={`${t("submitProduct.contactLabelLabel")} (${t("submitProduct.en")})`}>
                    <input
                      type="text"
                      value={row.label_en}
                      onChange={(e) => updateRow("contacts", i, { label_en: e.target.value })}
                      className={inputClasses}
                    />
                  </Field>
                  <Field label={`${t("submitProduct.contactLabelLabel")} (${t("submitProduct.bg")})`}>
                    <input
                      type="text"
                      value={row.label_bg}
                      onChange={(e) => updateRow("contacts", i, { label_bg: e.target.value })}
                      className={inputClasses}
                    />
                  </Field>
                </div>
              </RowCard>
            ))}
            <AddButton
              label={t("submitProduct.addContact")}
              onClick={() => addRow("contacts", emptyContact)}
            />
          </Section>

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
              <i className="fas fa-circle-exclamation text-red-500" aria-hidden="true" />
              <p className="text-sm text-red-700">{t("submitProduct.errorText")}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2 text-xs" aria-hidden="true" />
                  {t("submitProduct.submitting")}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2 text-xs" aria-hidden="true" />
                  {t("submitProduct.submit")}
                </>
              )}
            </button>
          </div>
        </form>
      </Container>
    </>
  );
}

function Section({ title, help, children }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {help && <p className="mt-1 text-sm text-gray-500">{help}</p>}
      </div>
      {children}
    </section>
  );
}

const Field = forwardRef(function Field({ label, required, hint, error, children }, ref) {
  return (
    <div ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {hint && <span className="font-normal text-gray-400 ml-1">({hint})</span>}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {Array.isArray(error) ? error.join(" ") : error}
        </p>
      )}
    </div>
  );
});

function BilingualField({
  label,
  required,
  hint,
  t,
  valueEn,
  valueBg,
  onChangeEn,
  onChangeBg,
  errorEn,
  errorBg,
  textarea,
}) {
  const Input = textarea ? "textarea" : "input";
  const extra = textarea ? { rows: 4 } : { type: "text" };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {hint && <span className="font-normal text-gray-400 ml-1">({hint})</span>}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="space-y-3">
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-1">
            {t("submitProduct.en")}
          </span>
          <Input
            {...extra}
            required={required}
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            className={`${inputClasses}${textarea ? " resize-vertical" : ""}`}
          />
          {errorEn && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(errorEn) ? errorEn.join(" ") : errorEn}
            </p>
          )}
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-1">
            {t("submitProduct.bg")}
          </span>
          <Input
            {...extra}
            required={required}
            value={valueBg}
            onChange={(e) => onChangeBg(e.target.value)}
            className={`${inputClasses}${textarea ? " resize-vertical" : ""}`}
          />
          {errorBg && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(errorBg) ? errorBg.join(" ") : errorBg}
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">{t("submitProduct.languageHint")}</p>
    </div>
  );
}

function RowCard({ onRemove, removeLabel, children }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
        aria-label={removeLabel}
      >
        <i className="fas fa-circle-xmark" aria-hidden="true" />
      </button>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
    >
      <i className="fas fa-plus text-xs" aria-hidden="true" />
      {label}
    </button>
  );
}
