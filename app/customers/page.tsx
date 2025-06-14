import React from "react";

export default async function CustomersPage() {
  // Fetch customers created today from our API route
  const res = await fetch("/api/customers?createdToday=true", {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Today's Customers</h1>
        <p className="text-red-500">Failed to load customers.</p>
      </div>
    );
  }

  const customers = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Today's Customers</h1>
      {Array.isArray(customers) && customers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Stripe ID</th>
              <th className="py-2 px-4 border-b">Num Free Submissions</th>
              <th className="py-2 px-4 border-b">Stripe Link</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: any) => (
              <tr key={customer.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{customer.id}</td>
                <td className="py-2 px-4 border-b">{customer.email || "N/A"}</td>
                <td className="py-2 px-4 border-b">{customer.stripeId}</td>
                <td className="py-2 px-4 border-b">{customer.num_free_submissions}</td>
                <td className="py-2 px-4 border-b">
                  <a
                    className="text-blue-600 underline"
                    href={customer.stripeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in Stripe
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found for today.</p>
      )}
    </div>
  );
}
