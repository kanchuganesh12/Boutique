import { Modal } from '../ui/Overlay'

const ROWS = [
  ['XS', '32', '26', '35'],
  ['S', '34', '28', '37'],
  ['M', '36', '30', '39'],
  ['L', '38', '32', '41'],
  ['XL', '40', '34', '43'],
  ['XXL', '42', '36', '45'],
]

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <div className="space-y-5 p-5 text-sm">
        <p className="text-muted">
          Measurements are body measurements in inches. Between sizes? Choose the larger size for a relaxed fit.
        </p>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left">
            <thead className="bg-ivory-deep text-xs font-bold text-muted">
              <tr>
                {['Size', 'Bust', 'Waist', 'Hip'].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r[0]} className="border-t border-border bg-white">
                  {r.map((c, i) => (
                    <td key={i} className={i === 0 ? 'px-4 py-2.5 font-semibold' : 'px-4 py-2.5'}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-ivory-deep p-3">
            <p className="font-semibold">Sarees & dupattas</p>
            <p className="text-muted">Free size — 5.5 m saree with 0.8 m unstitched blouse piece.</p>
          </div>
          <div className="rounded-md bg-ivory-deep p-3">
            <p className="font-semibold">Blouses (32–38)</p>
            <p className="text-muted">Numbered sizes match your bust measurement in inches.</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
