import { BlogPost } from "@/lib/blog";

const content = (
  <article className="blog-post">
    <p className="lead">
      E-commerce and warehouse operations face a common challenge: efficiently
      packing irregularly-sized items into shipping boxes. Manual packing often
      results in wasted space, excess boxes, and higher shipping costs.
    </p>

    <h2>The Problem</h2>
    <p>
      The goal was to automate box packing optimization. After evaluating
      several approaches, I implemented a{" "}
      <strong>Guillotine-based 3D bin packing algorithm</strong> with rotation
      support.
    </p>

    <h2>Technical Approach</h2>
    <p>The algorithm works in three phases:</p>

    <h3>1. Sorting Phase</h3>
    <p>
      Items sorted by volume (largest first). This improves packing efficiency
      by placing large items before fragmenting available space.
    </p>

    <pre>
      <code>{`items.sort((a, b) => {
  const volumeA = a.length * a.width * a.height;
  const volumeB = b.length * b.width * b.height;
  return volumeB - volumeA;
});`}</code>
    </pre>

    <h3>2. Placement Phase</h3>
    <p>
      For each item, the algorithm tries all possible orientations and
      positions, selecting the placement that minimizes wasted space.
    </p>

    <pre>
      <code>{`function findBestFit(item: Item, availableSpace: Region[]): Placement | null {
  const orientations = generateOrientations(item);
  let bestFit: Placement | null = null;
  let minWaste = Infinity;

  for (const orientation of orientations) {
    for (const region of availableSpace) {
      if (fitsInRegion(orientation, region)) {
        const waste = calculateWaste(orientation, region);
        if (waste < minWaste) {
          minWaste = waste;
          bestFit = { orientation, region, waste };
        }
      }
    }
  }

  return bestFit;
}`}</code>
    </pre>

    <h3>3. Space Update Phase</h3>
    <p>
      After placing an item, available space is updated using guillotine cuts,
      creating new rectangular regions from remaining space.
    </p>

    <h2>Key Challenges</h2>

    <h3>Weight Distribution</h3>
    <p>
      Boxes have weight limits. The algorithm tracks cumulative weight per box
      and starts a new box when the limit is reached, even if space remains.
    </p>

    <pre>
      <code>{`function canAddItem(box: Box, item: Item): boolean {
  const currentWeight = box.items.reduce((sum, i) => sum + i.weight, 0);
  return (currentWeight + item.weight) <= box.maxWeight;
}`}</code>
    </pre>

    <h3>Rotation Handling</h3>
    <p>
      Items can be oriented six different ways. Testing all orientations is
      expensive, so the algorithm pre-filters invalid orientations based on box
      dimensions.
    </p>

    <h3>Performance Optimization</h3>
    <p>Solutions implemented:</p>
    <ul>
      <li>Cache valid orientations</li>
      <li>Use spatial indexing for region lookups</li>
      <li>Early termination when perfect fit found</li>
      <li>Merge adjacent regions to reduce fragmentation</li>
    </ul>

    <h2>Results</h2>
    <p>
      Typical packing efficiency: <strong>75-85% space utilization</strong> vs
      50-60% manual packing
    </p>

    <div className="mt-4 space-y-2 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900 shadow-sm dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-100">
      <strong>Example:</strong> 20 mixed-size items across 3 box types
      <ul className="list-inside list-disc space-y-1">
        <li>Manual: 6 boxes, 55% utilization</li>
        <li>Algorithm: 4 boxes, 78% utilization</li>
        <li>
          <strong>Savings:</strong> 33% fewer boxes, 30% lower shipping costs
        </li>
      </ul>
    </div>

    <h2>Database Integration</h2>
    <p>
      Saved item configurations are stored in MongoDB, allowing users to save
      and reload common shipping scenarios.
    </p>

    <pre>
      <code>{`interface SavedConfiguration {
  userId: string;
  name: string;
  items: Item[];
  boxes: Box[];
  totalCost: number;
  createdAt: Date;
}`}</code>
    </pre>

    <h2>Tech Stack</h2>
    <ul>
      <li>
        <strong>Framework:</strong> Next.js 14 with App Router
      </li>
      <li>
        <strong>Language:</strong> TypeScript (strict mode)
      </li>
      <li>
        <strong>Database:</strong> MongoDB for saved configurations
      </li>
      <li>
        <strong>Auth:</strong> Clerk for user-scoped data
      </li>
      <li>
        <strong>Styling:</strong> Tailwind CSS (migrated from Bootstrap 5)
      </li>
    </ul>

    <h2>Future Improvements</h2>
    <ol>
      <li>Dynamic box selection - auto-select optimal box sizes</li>
      <li>Fragility handling - pack fragile items last, on top</li>
      <li>Load balancing - better weight distribution within boxes</li>
      <li>3D visualization - preview of packed boxes</li>
    </ol>

    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100">
      <strong>Key Takeaway:</strong> Complex packing problems benefit from
      heuristic algorithms rather than brute force. The guillotine approach
      provides a good balance of efficiency and optimality for real-world
      shipping scenarios.
    </div>
  </article>
);

export const boxShippingPost: BlogPost = {
  slug: "box-shipping-calculator",
  title: "Box Shipping Calculator: 3D Bin Packing Algorithm",
  date: "2024-11-04",
  excerpt:
    "Implementing a Guillotine-based 3D bin packing algorithm to optimize shipping box configurations. Achieving 75-85% space utilization vs 50-60% manual packing.",
  tags: ["algorithms", "typescript", "optimization", "cnc-tools"],
  content,
  readTime: 8,
  bookstackUrl:
    "http://bookstack.deejpotter.com/books/technical-blog-project-write-ups/page/box-shipping-calculator-3d-bin-packing-algorithm",
};
