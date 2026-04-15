'use client';

import { useState, useMemo } from 'react';

const BASE = '/example_conf';

const OPTIONS = {
  case: [
    { value: 'black', label: 'Black' },
    { value: 'gold', label: 'Gold' },
    { value: 'goldpolished', label: 'Gold Polished' },
    { value: 'rose', label: 'Rose' },
    { value: 'roseposlihed', label: 'Rose Polished' },
    { value: 'rosesilver', label: 'Rose Silver' },
    { value: 'rosesilverposlihed', label: 'Rose Silver Polished' },
    { value: 'silver', label: 'Silver' },
    { value: 'silvergold', label: 'Silver Gold' },
    { value: 'silvergoldpolished', label: 'Silver Gold Polished' },
  ],
  dial: [
    { value: 'arabicblack', label: 'Arabic Black' },
    { value: 'blackrose', label: 'Black Rose' },
    { value: 'blackwhite', label: 'Black White' },
    { value: 'blue', label: 'Blue' },
    { value: 'bluegold', label: 'Blue Gold' },
    { value: 'classic grey', label: 'Classic Grey' },
    { value: 'classic', label: 'Classic' },
    { value: 'greennumbers', label: 'Green Numbers' },
    { value: 'lineblack', label: 'Line Black' },
    { value: 'magenta', label: 'Magenta' },
    { value: 'oceanblue', label: 'Ocean Blue' },
    { value: 'olivegreen', label: 'Olive Green' },
    { value: 'orange', label: 'Orange' },
    { value: 'orbitsilver', label: 'Orbit Silver' },
    { value: 'poker', label: 'Poker' },
    { value: 'silver', label: 'Silver' },
    { value: 'whocares', label: 'Who Cares' },
    { value: 'wimbledon', label: 'Wimbledon' },
    { value: 'wimbledonsilver', label: 'Wimbledon Silver' },
    { value: 'yellowgold', label: 'Yellow Gold' },
  ],
  bracelet: [
    { value: 'balckrubber', label: 'Black Rubber' },
    { value: 'blackoyster', label: 'Black Oyster' },
    { value: 'blackpresident', label: 'Black President' },
    { value: 'blackyubiller', label: 'Black Jubilee' },
    { value: 'jubillesilver', label: 'Jubilee Silver' },
    { value: 'leather', label: 'Leather' },
    { value: 'oysterrose', label: 'Oyster Rose' },
    { value: 'oystersilvergold', label: 'Oyster Silver Gold' },
    { value: 'oystersilverrose', label: 'Oyster Silver Rose' },
    { value: 'oyster_gold', label: 'Oyster Gold' },
    { value: 'oyster_silver', label: 'Oyster Silver' },
    { value: 'president_gold', label: 'President Gold' },
    { value: 'president_silver', label: 'President Silver' },
    { value: 'whiterubber', label: 'White Rubber' },
    { value: 'yubilesilvergold', label: 'Jubilee Silver Gold' },
    { value: 'yubilesilverrose', label: 'Jubilee Silver Rose' },
    { value: 'yubillerrose', label: 'Jubilee Rose' },
    { value: 'yubillerrosegold', label: 'Jubilee Rose Gold' },
    { value: 'yubille_gold', label: 'Jubilee Gold' },
  ],
  hands: [
    { value: 'gold', label: 'Gold' },
    { value: 'rose', label: 'Rose' },
    { value: 'silver', label: 'Silver' },
  ],
  secondhands: [
    { value: 'bronze', label: 'Bronze' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
  ],
  date: [{ value: 'withmagnificer', label: 'With Magnifier' }],
} as const;

function imgUrl(folder: string, filename: string): string {
  const encoded = encodeURIComponent(filename);
  return `${BASE}/${folder}/${encoded}`;
}

export function ClockConfigurator() {
  const [caseVal, setCaseVal] = useState('black');
  const [dial, setDial] = useState('classic');
  const [bracelet, setBracelet] = useState('oyster_silver');
  const [hands, setHands] = useState('silver');
  const [secondhands, setSecondhands] = useState('silver');
  const [dateVal] = useState('withmagnificer');

  const layers = useMemo(
    () => [
      { folder: 'case', file: caseVal },
      { folder: 'dial', file: dial },
      { folder: 'date', file: dateVal },
      { folder: 'hands', file: hands },
      { folder: 'secondhands', file: secondhands },
      { folder: 'bracelet', file: bracelet },
    ],
    [caseVal, dial, dateVal, hands, secondhands, bracelet]
  );

  return (
    <div className="clock-configurator w-full">
      <div className="flex flex-col gap-6 items-center">
        {/* Watch preview - layered images, transparent so page background shows */}
        <div className="relative aspect-square w-full max-w-[400px] flex items-center justify-center overflow-visible">
          <div className="relative w-full h-full flex items-center justify-center scale-[1.25]">
            {layers.map(({ folder, file }, i) => (
              <img
                key={`${folder}-${file}`}
                src={imgUrl(folder, file.includes('.') ? file : `${file}.png`)}
                alt=""
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ zIndex: i }}
                draggable={false}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-widest text-bioluminescence/90 mb-1.5">
              Case
            </label>
            <select
              value={caseVal}
              onChange={(e) => setCaseVal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-bioluminescence/50 focus:ring-1 focus:ring-bioluminescence/30 outline-none transition-colors"
            >
              {OPTIONS.case.map((o) => (
                <option key={o.value} value={o.value} className="bg-obsidian text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-widest text-bioluminescence/90 mb-1.5">
              Dial
            </label>
            <select
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-bioluminescence/50 focus:ring-1 focus:ring-bioluminescence/30 outline-none transition-colors"
            >
              {OPTIONS.dial.map((o) => (
                <option key={o.value} value={o.value} className="bg-obsidian text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-bioluminescence/90 mb-1.5">
              Bracelet
            </label>
            <select
              value={bracelet}
              onChange={(e) => setBracelet(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-bioluminescence/50 focus:ring-1 focus:ring-bioluminescence/30 outline-none transition-colors"
            >
              {OPTIONS.bracelet.map((o) => (
                <option key={o.value} value={o.value} className="bg-obsidian text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-widest text-bioluminescence/90 mb-1.5">
              Hands
            </label>
            <select
              value={hands}
              onChange={(e) => setHands(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-bioluminescence/50 focus:ring-1 focus:ring-bioluminescence/30 outline-none transition-colors"
            >
                {OPTIONS.hands.map((o) => (
                  <option key={o.value} value={o.value} className="bg-obsidian text-white">
                    {o.label}
                  </option>
                ))}
              </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-widest text-bioluminescence/90 mb-1.5">
              Second Hand
            </label>
            <select
              value={secondhands}
              onChange={(e) => setSecondhands(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-bioluminescence/50 focus:ring-1 focus:ring-bioluminescence/30 outline-none transition-colors"
            >
                {OPTIONS.secondhands.map((o) => (
                  <option key={o.value} value={o.value} className="bg-obsidian text-white">
                    {o.label}
                  </option>
                ))}
              </select>
          </div>
        </div>
      </div>
    </div>
  );
}
