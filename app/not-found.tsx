import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Video Not Found',
};

export default function NotFoundPage() {
  notFound();
}
