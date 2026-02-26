import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

// Карта кастомных названий для сегментов URL
const CUSTOM_LABELS: Record<string, string> = {
  listeners: "Слушатели",
  new_listener: "Новый слушатель",
  programs: "Программы",
  new_program: "Новая программа",
  chat: "Сообщения",
  documents: "Дипломы",
  administrators: "Администраторы",
  new_admin: "Новый администратор"
  // добавляй сюда другие нужные сегменты
};

const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);

  // игнорируем 'admin' как базовый путь
  const filteredSegments = segments[0] === "admin" ? segments.slice(1) : segments;

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Главная", to: "/" }];

  filteredSegments.forEach((seg, i) => {
    const path = "/admin/" + filteredSegments.slice(0, i + 1).join("/");
    const label = CUSTOM_LABELS[seg] ?? seg.replace(/-/g, " ");
    breadcrumbs.push({ label, to: i < filteredSegments.length - 1 ? path : undefined });
  });

  return breadcrumbs;
};

const AdminPath: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <nav className="text-base text-gray-600 mb-7 flex flex-wrap items-center">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {item.to ? (
            <Link to={item.to} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold">{item.label}</span>
          )}
          {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default AdminPath;