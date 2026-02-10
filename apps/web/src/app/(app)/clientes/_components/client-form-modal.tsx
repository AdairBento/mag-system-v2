"use client";

import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from "@/lib/utils/masks";
import type { Client, ClientType, ClientStatus } from "@/types/client";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Client) => void;
  initialData?: Client | null;
  title: string;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: ClientType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: ClientStatus;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  document: "",
  documentType: "CPF",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  status: "ACTIVE",
};

export function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: ClientFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        document: initialData.document ?? "",
        documentType: initialData.documentType ?? "CPF",
        address: initialData.address ?? "",
        city: initialData.city ?? "",
        state: initialData.state ?? "",
        zipCode: initialData.zipCode ?? "",
        status: initialData.status ?? "ACTIVE",
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, initialData]);

  const setField = (name: keyof FormState, value: string) =>
    setForm((p) => ({ ...p, [name]: value }));

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setField(name as keyof FormState, value);
  };

  const onDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const masked = form.documentType === "CPF" ? maskCPF(value) : maskCNPJ(value);
    setField("document", masked);
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setField("phone", masked);
  };

  const onCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setField("zipCode", masked);
  };

  const onDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ClientType;
    setField("documentType", newType);
    setField("document", ""); // Limpa documento ao trocar tipo
  };

  const isValid = (): boolean => {
    if (!form.name.trim()) return false;
    if (!form.email.trim()) return false;
    if (!form.phone.replace(/\D/g, "")) return false;
    if (!form.document.replace(/\D/g, "")) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    setLoading(true);
    try {
      const clientData: Client = {
        ...(initialData?.id && { id: initialData.id }),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ""),
        document: form.document.replace(/\D/g, ""),
        documentType: form.documentType,
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        zipCode: form.zipCode.replace(/\D/g, "") || undefined,
        status: form.status,
      };

      onSubmit(clientData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={24} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Cliente */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de Cliente *
            </label>
            <select
              name="documentType"
              value={form.documentType}
              onChange={onDocumentTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="CPF">Pessoa Física (CPF)</option>
              <option value="CNPJ">Pessoa Jurídica (CNPJ)</option>
            </select>
          </div>

          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome/Razão Social *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder={form.documentType === "CPF" ? "João Silva" : "Empresa LTDA"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {form.documentType === "CPF" ? "CPF" : "CNPJ"} *
              </label>
              <input
                type="text"
                name="document"
                value={form.document}
                onChange={onDocumentChange}
                required
                maxLength={form.documentType === "CPF" ? 14 : 18}
                placeholder={form.documentType === "CPF" ? "123.456.789-00" : "00.000.000/0000-00"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onPhoneChange}
                required
                maxLength={15}
                placeholder="(31) 99999-9999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="contato@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">CEP</label>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={onCEPChange}
                  maxLength={9}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="Belo Horizonte"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={onChange}
                  maxLength={2}
                  placeholder="MG"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Rua, número, bairro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
              <option value="BLOCKED">Bloqueado</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !isValid()}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
