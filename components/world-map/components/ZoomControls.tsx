import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Prop {
  /** Current zoom level */
  zoom: number;
  /** Maximum zoom level */
  maxZoom: number;
  /** Minimum zoom level */
  minZoom: number;
  /** Callback to zoom in */
  onZoomIn: () => void;
  /** Callback to zoom out */
  onZoomOut: () => void;
  /** Callback to reset view */
  onReset: () => void;
}

/**
 * Component rendering zoom control buttons
 */
export function ZoomControls({ zoom, maxZoom, minZoom, onZoomIn, onZoomOut, onReset }: Prop) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
        title="Zoom In">
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
        title="Zoom Out">
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onReset}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
        title="Reset View">
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
