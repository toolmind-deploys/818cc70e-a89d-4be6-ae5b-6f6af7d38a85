import React from "react";

export default async function FeedsPage() {
  // Fetch all feeds from our API route
  const res = await fetch("/api/feeds", {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Feeds</h1>
        <p className="text-red-500">Failed to load feeds.</p>
      </div>
    );
  }

  const feeds = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Feeds</h1>
      {Array.isArray(feeds) && feeds.length > 0 ? (
        <ul className="list-disc list-inside">
          {feeds.map((feed: any) => (
            <li key={feed.id} className="mb-2">
              <div className="font-semibold">{feed.title}</div>
              <div className="text-sm text-gray-600">{feed.company}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feeds found.</p>
      )}
    </div>
  );
}
