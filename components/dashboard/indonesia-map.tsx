"use client";

import * as React from "react";

export type ProvinceMetric = {
  key: string;
  label: string;
  revenue: string;
  growth: string;
  coverage: string;
  returns: string;
};

export type ProvinceCityRank = {
  city: string;
  branch: string;
  sellOut: string;
  growth: string;
  activeOutlets: string;
  note: string;
};

type IndonesiaMapProps = {
  activeProvince?: ProvinceMetric;
  onProvinceSelect?: (province: ProvinceMetric) => void;
};

type TooltipState = {
  province: ProvinceMetric;
  x: number;
  y: number;
};

function hashCode(value: string) {
  return Array.from(value).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
}

const provinceCityMap: Record<string, string[]> = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Barat", "Jakarta Timur", "Jakarta Selatan", "Jakarta Utara", "Kepulauan Seribu"],
  Jakarta: ["Jakarta Pusat", "Jakarta Barat", "Jakarta Timur", "Jakarta Selatan", "Jakarta Utara", "Kepulauan Seribu"],
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Cirebon", "Tasikmalaya", "Sukabumi", "Karawang", "Cimahi"],
  "Jawa Tengah": ["Semarang", "Solo", "Tegal", "Purwokerto", "Magelang", "Pekalongan", "Kudus", "Salatiga"],
  "Jawa Timur": ["Surabaya", "Malang", "Kediri", "Jember", "Madiun", "Sidoarjo", "Probolinggo", "Mojokerto"],
  Banten: ["Tangerang", "Serang", "Cilegon", "Pandeglang", "Lebak", "Tangerang Selatan"],
  Yogyakarta: ["Yogyakarta", "Sleman", "Bantul", "Kulon Progo", "Gunungkidul", "Wates"],
  Bali: ["Denpasar", "Badung", "Gianyar", "Tabanan", "Singaraja", "Karangasem"],
  "Sumatera Utara": ["Medan", "Pematangsiantar", "Binjai", "Tebing Tinggi", "Kisaran", "Rantauprapat"],
  "Sumatera Selatan": ["Palembang", "Lubuklinggau", "Prabumulih", "Baturaja", "Lahat", "Pagar Alam"],
  "Sulawesi Selatan": ["Makassar", "Parepare", "Palopo", "Bone", "Bulukumba", "Maros"],
  Kalimantan: ["Balikpapan", "Samarinda", "Banjarmasin", "Pontianak", "Palangkaraya", "Tarakan"],
};

function getProvinceCities(name: string) {
  const normalized = normalizeProvinceName(name);
  return provinceCityMap[normalized] ?? [
    `${normalized} Kota 1`,
    `${normalized} Kota 2`,
    `${normalized} Kota 3`,
    `${normalized} Kota 4`,
    `${normalized} Kota 5`,
    `${normalized} Kota 6`,
  ];
}

export function normalizeProvinceName(raw: string) {
  if (raw.includes("Jakarta")) return "Jakarta";
  if (raw.includes("Sumatra")) return raw.replace("Sumatra", "Sumatera");
  return raw;
}

export function buildProvinceMetric(name: string): ProvinceMetric {
  const hash = hashCode(name);
  const units = 120 + (hash % 860);
  const growthRaw = ((hash % 220) - 40) / 10;
  const coverage = 240 + (hash % 780);
  const returns = 18 + (hash % 145);

  return {
    key: name,
    label: name,
    revenue: `${units.toLocaleString("id-ID")} ribu unit`,
    growth: `${growthRaw >= 0 ? "+" : ""}${growthRaw.toFixed(1)}%`,
    coverage: `${coverage.toLocaleString("id-ID")} outlet`,
    returns: `${returns.toLocaleString("id-ID")} outlet`,
  };
}

export function buildProvinceCityRanking(name: string, productName: string) {
  const cities = getProvinceCities(name);

  return cities
    .map((city, index) => {
      const itemHash = hashCode(`${name}-${productName}-${city}`);
      const unitBase = Math.max(115, 760 - index * 74 + (itemHash % 48));
      const growthRaw = ((itemHash % 180) - 35) / 10;
      const activeOutlets = Math.max(26, 118 - index * 9 + (itemHash % 6));
      const branchSuffixes = ["Inti", "Utara", "Selatan", "Timur", "Barat", "Pusat"];

      return {
        city,
        branch: `${city} ${branchSuffixes[index % branchSuffixes.length]}`,
        sellOutValue: unitBase,
        sellOut: `${unitBase.toLocaleString("id-ID")} ribu unit`,
        growth: `${growthRaw >= 0 ? "+" : ""}${growthRaw.toFixed(1)}%`,
        activeOutlets: `${activeOutlets.toLocaleString("id-ID")} outlet`,
        note: `${productName} paling kuat di area ${city}`,
      };
    })
    .sort((left, right) => right.sellOutValue - left.sellOutValue)
    .map(({ sellOutValue: _sellOutValue, ...item }) => item satisfies ProvinceCityRank);
}

const DEFAULT_PROVINCE_NAME = "Jawa Barat";

export function IndonesiaMap({ activeProvince, onProvinceSelect }: IndonesiaMapProps) {
  const [svgMarkup, setSvgMarkup] = React.useState("");
  const [hoveredProvinceKey, setHoveredProvinceKey] = React.useState<string | null>(null);
  const [tooltip, setTooltip] = React.useState<TooltipState | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const defaultProvince = React.useMemo(() => buildProvinceMetric(DEFAULT_PROVINCE_NAME), []);
  const [internalActiveProvince, setInternalActiveProvince] = React.useState<ProvinceMetric>(
    activeProvince ?? defaultProvince,
  );
  const selectedProvince = activeProvince ?? internalActiveProvince;
  const selectedProvinceKey = selectedProvince.key;

  React.useEffect(() => {
    fetch("/indonesia-provinces-outline.svg")
      .then((response) => response.text())
      .then((svg) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(svg, "image/svg+xml");
        const svgElement = document.querySelector("svg");
        if (!svgElement) return;

        svgElement.setAttribute("class", "h-full w-full indonesia-map-svg");
        svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

        const paths = Array.from(document.querySelectorAll("path[id]")) as SVGPathElement[];

        paths.forEach((path) => {
          const rawId = path.getAttribute("id");
          if (!rawId || rawId === "layer") return;

          const provinceName = normalizeProvinceName(rawId);
          path.setAttribute("data-province", provinceName);
          path.removeAttribute("fill");
        });

        setSvgMarkup(svgElement.outerHTML);
      })
      .catch((err) => console.error("Error loading SVG", err));
  }, []);

  React.useEffect(() => {
    if (!activeProvince) return;
    setInternalActiveProvince(activeProvince);
  }, [activeProvince]);

  React.useEffect(() => {
    if (hoveredProvinceKey !== null) return;
    if (!svgMarkup) return;

    const container = containerRef.current;
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    const safeKey = selectedProvinceKey.replace(/"/g, '\\"');
    const activePath = svg.querySelector(
      `path[data-province="${safeKey}"]`,
    ) as SVGPathElement | null;

    if (!activePath) return;

    const containerRect = container.getBoundingClientRect();
    const pathRect = activePath.getBoundingClientRect();
    
    setTooltip({
      province: selectedProvince,
      x: Math.min(
        Math.max(pathRect.left - containerRect.left + pathRect.width / 2, 100),
        Math.max(containerRect.width - 100, 100),
      ),
      y: Math.min(
        Math.max(pathRect.top - containerRect.top + pathRect.height / 2 - 18, 120),
        Math.max(containerRect.height - 28, 120),
      ),
    });
  }, [selectedProvince, selectedProvinceKey, hoveredProvinceKey, svgMarkup]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    const provinceName = target.getAttribute && target.getAttribute("data-province");
    
    if (!provinceName) {
      if (hoveredProvinceKey !== null) {
        setHoveredProvinceKey(null);
      }
      return;
    }

    if (provinceName !== hoveredProvinceKey) {
      setHoveredProvinceKey(provinceName);
    }

    const metric = buildProvinceMetric(provinceName);
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    setTooltip({
      province: metric,
      x: Math.min(Math.max(e.clientX - containerRect.left, 100), Math.max(containerRect.width - 100, 100)),
      y: Math.min(Math.max(e.clientY - containerRect.top - 18, 120), Math.max(containerRect.height - 28, 120)),
    });
  };

  const handleMouseLeave = () => {
    setHoveredProvinceKey(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    const provinceName = target.getAttribute && target.getAttribute("data-province");
    if (!provinceName) return;

    e.preventDefault();
    const metric = buildProvinceMetric(provinceName);
    setInternalActiveProvince(metric);
    onProvinceSelect?.(metric);
  };

  const hoveredStyle = hoveredProvinceKey ? `
    .indonesia-map-svg path[data-province="${hoveredProvinceKey.replace(/"/g, '\\"')}"] {
      fill: #3f3530;
      stroke: #f28c38;
      stroke-width: 1.4;
    }
  ` : "";

  const selectedStyle = selectedProvinceKey ? `
    .indonesia-map-svg path[data-province="${selectedProvinceKey.replace(/"/g, '\\"')}"] {
      fill: #f28c38 !important;
      stroke: #ffb26f !important;
      stroke-width: 1.8 !important;
    }
  ` : "";

  const mapStyles = `
    .indonesia-map-svg path[data-province] {
      fill: #263142;
      stroke: #3c475b;
      stroke-width: 1;
      cursor: pointer;
      outline: none;
      vector-effect: non-scaling-stroke;
      transition: fill 160ms ease, stroke 160ms ease, stroke-width 160ms ease;
    }
    ${hoveredStyle}
    ${selectedStyle}
  `;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[360px] overflow-hidden rounded-[1.8rem] bg-[hsl(223_18%_14%)] ring-1 ring-white/5"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <style>{mapStyles}</style>
      <div
        className="absolute inset-0"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
      {tooltip ? (
        <div
          className="pointer-events-none absolute z-10 w-[190px] -translate-x-1/2 -translate-y-full rounded-[1.1rem] border border-border/70 bg-popover px-4 py-3 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-100 ease-out"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/80">
            Provinsi Aktif
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">{tooltip.province.label}</div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <span>Sell-out</span>
            <span className="text-right font-medium text-foreground">{tooltip.province.revenue}</span>
            <span>Pertumbuhan</span>
            <span className="text-right font-medium text-foreground">{tooltip.province.growth}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
