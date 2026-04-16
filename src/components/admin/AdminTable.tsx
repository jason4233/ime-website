"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface AdminTableProps<T extends { id: string; order?: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onReorder?: (items: T[]) => void;
  sortable?: boolean;
}

function SortableRow<T extends { id: string }>({
  item,
  columns,
  onEdit,
  onDelete,
}: {
  item: T;
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-ivory/5 hover:bg-ivory/[0.02]">
      <td className="px-3 py-3 w-8">
        <button {...attributes} {...listeners} className="cursor-grab text-ivory/20 hover:text-ivory/40 active:cursor-grabbing">
          ⠿
        </button>
      </td>
      {columns.map((col) => (
        <td key={col.key} className="px-3 py-3 text-sm text-ivory/60 font-body" style={{ width: col.width }}>
          {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
        </td>
      ))}
      <td className="px-3 py-3 text-right space-x-2">
        <button
          onClick={() => onEdit(item)}
          className="px-3 py-1 text-xs font-body text-brand-light border border-brand/20 rounded
                     hover:bg-brand/10 transition-colors duration-200
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/40"
        >
          編輯
        </button>
        <button
          onClick={() => onDelete(item)}
          className="px-3 py-1 text-xs font-body text-rose-nude border border-rose-nude/20 rounded
                     hover:bg-rose-nude/10 transition-colors duration-200
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-nude/40"
        >
          刪除
        </button>
      </td>
    </tr>
  );
}

export function AdminTable<T extends { id: string; order?: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onReorder,
  sortable = true,
}: AdminTableProps<T>) {
  const [items, setItems] = useState(data);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // 同步外部 data 更新
  if (data !== items && JSON.stringify(data.map(d => d.id)) !== JSON.stringify(items.map(i => i.id))) {
    setItems(data);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder?.(newItems);
  }

  const content = (
    <table className="w-full">
      <thead>
        <tr className="border-b border-ivory/8">
          {sortable && <th className="px-3 py-2 w-8" />}
          {columns.map((col) => (
            <th key={col.key} className="px-3 py-2 text-left text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body" style={{ width: col.width }}>
              {col.label}
            </th>
          ))}
          <th className="px-3 py-2 text-right text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body">
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        {sortable ? (
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableRow key={item.id} item={item} columns={columns} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </SortableContext>
        ) : (
          items.map((item) => (
            <tr key={item.id} className="border-b border-ivory/5 hover:bg-ivory/[0.02]">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3 text-sm text-ivory/60 font-body" style={{ width: col.width }}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              <td className="px-3 py-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="px-3 py-1 text-xs font-body text-brand-light border border-brand/20 rounded hover:bg-brand/10 transition-colors">
                  編輯
                </button>
                <button onClick={() => onDelete(item)} className="px-3 py-1 text-xs font-body text-rose-nude border border-rose-nude/20 rounded hover:bg-rose-nude/10 transition-colors">
                  刪除
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  if (sortable) {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto rounded-lg border border-ivory/5 bg-ivory/[0.01]">
          {content}
        </div>
      </DndContext>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ivory/5 bg-ivory/[0.01]">
      {content}
    </div>
  );
}
