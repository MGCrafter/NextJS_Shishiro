"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "../../lib/config";
import { toast } from 'react-toastify';
import useUserStore from "../../lib/state";
import { Save } from 'lucide-react';

interface AppearanceSettings {
  id?: number;
  gradient_color_1: string;
  gradient_color_2: string;
  gradient_opacity: number;
  gradient_thickness: number;
  button_bg_color: string;
  text_color: string;
  font_family: string;
}

const AppearanceEditor = () => {
  const token = useUserStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppearanceSettings>({
    gradient_color_1: '#ec4899',
    gradient_color_2: '#8b5cf6',
    gradient_opacity: 0.9,
    gradient_thickness: 32,
    button_bg_color: '#020617',
    text_color: '#ffffff',
    font_family: 'Inter'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.APPEARANCE}?limit=1`, { headers });
        if (!response.ok) {
          console.error('Appearance settings not found, using defaults');
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setSettings(data.data[0]);
        }
      } catch (error) {
        console.error('AppearanceEditor fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const getHeaders = () => {
    const h: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  };

  const handleSave = async () => {
    try {
      const method = settings.id ? 'PATCH' : 'POST';
      const url = settings.id
        ? `${DIRECTUS_URL}/items/${MODELS.APPEARANCE}/${settings.id}`
        : `${DIRECTUS_URL}/items/${MODELS.APPEARANCE}`;

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          gradient_color_1: settings.gradient_color_1,
          gradient_color_2: settings.gradient_color_2,
          gradient_opacity: settings.gradient_opacity,
          gradient_thickness: settings.gradient_thickness,
          button_bg_color: settings.button_bg_color,
          text_color: settings.text_color,
          font_family: settings.font_family
        }),
      });

      if (!response.ok) throw new Error("Fehler beim Speichern");

      const result = await response.json();
      if (!settings.id) {
        setSettings({ ...settings, id: result.data.id });
      }

      toast.success("Appearance-Einstellungen gespeichert!");
    } catch (error) {
      toast.error("Fehler beim Speichern der Einstellungen.");
      console.error(error);
    }
  };

  if (loading) return <div className="p-4 text-slate-400 text-center">Lade Einstellungen...</div>;

  return (
    <div className="space-y-6 w-full max-w-3xl">
      {/* Preview */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Vorschau
        </h3>
        <div className="flex justify-center">
          <div
            className="relative h-28 w-80 rounded-[1.75rem] overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 50%, ${settings.gradient_color_1} 0%, ${settings.gradient_color_2} 100%)`,
              opacity: settings.gradient_opacity
            }}
          >
            <div
              className="absolute inset-[3px] rounded-[1.65rem] flex items-center justify-center text-xl font-medium"
              style={{
                backgroundColor: settings.button_bg_color,
                color: settings.text_color,
                fontFamily: settings.font_family
              }}
            >
              Beispiel Button
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Settings */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 space-y-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Gradient Border Einstellungen
        </h3>

        {/* Gradient Color 1 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gradient Farbe 1
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={settings.gradient_color_1}
              onChange={(e) => setSettings({...settings, gradient_color_1: e.target.value})}
              className="h-12 w-20 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.gradient_color_1}
              onChange={(e) => setSettings({...settings, gradient_color_1: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="#ec4899"
            />
          </div>
        </div>

        {/* Gradient Color 2 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gradient Farbe 2
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={settings.gradient_color_2}
              onChange={(e) => setSettings({...settings, gradient_color_2: e.target.value})}
              className="h-12 w-20 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.gradient_color_2}
              onChange={(e) => setSettings({...settings, gradient_color_2: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="#8b5cf6"
            />
          </div>
        </div>

        {/* Gradient Opacity */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gradient Opacity: {settings.gradient_opacity}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.gradient_opacity}
            onChange={(e) => setSettings({...settings, gradient_opacity: parseFloat(e.target.value)})}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Gradient Thickness */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gradient Thickness (Border Dicke): {settings.gradient_thickness}px
          </label>
          <input
            type="range"
            min="16"
            max="64"
            step="4"
            value={settings.gradient_thickness}
            onChange={(e) => setSettings({...settings, gradient_thickness: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Button Settings */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 space-y-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Button Einstellungen
        </h3>

        {/* Button Background Color */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Button Hintergrundfarbe
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={settings.button_bg_color}
              onChange={(e) => setSettings({...settings, button_bg_color: e.target.value})}
              className="h-12 w-20 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.button_bg_color}
              onChange={(e) => setSettings({...settings, button_bg_color: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="#020617"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Textfarbe
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={settings.text_color}
              onChange={(e) => setSettings({...settings, text_color: e.target.value})}
              className="h-12 w-20 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.text_color}
              onChange={(e) => setSettings({...settings, text_color: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Schriftart
          </label>
          <input
            type="text"
            value={settings.font_family}
            onChange={(e) => setSettings({...settings, font_family: e.target.value})}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Inter, Arial, sans-serif"
          />
          <p className="text-xs text-slate-500 mt-1">
            Tipp: Verwende Google Fonts Namen wie "Roboto", "Poppins", "Montserrat" etc.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Save size={18} />
          <span>Einstellungen speichern</span>
        </button>
      </div>
    </div>
  );
};

export default AppearanceEditor;
