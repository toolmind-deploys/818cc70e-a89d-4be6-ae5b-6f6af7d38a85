import React from "react";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  // Fetch a single customer from our API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/customers/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Customer</h1>
        <p className="text-red-500">Failed to load customer.</p>
      </div>
    );
  }

  const customer = await res.json();

  if (!customer || !customer.id) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Customer</h1>
        <p>No customer found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Customer Detail</h1>
      <div className="border border-gray-300 p-4 rounded">
        <p><strong>ID:</strong> {customer.id}</p>
        <p><strong>Email:</strong> {customer.email || "N/A"}</p>
        <p><strong>Stripe ID:</strong> {customer.stripeId || "N/A"}</p>
        <p><strong>Free Submissions:</strong> {customer.num_free_submissions ?? 0}</p>
        {customer.stripeLink && (
          <p>
            <strong>Stripe Link:</strong>{" "}
            <a
              href={customer.stripeLink}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View in Stripe
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
