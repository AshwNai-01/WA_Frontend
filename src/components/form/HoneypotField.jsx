// Spam trap: hidden from people, bots fill it in and the backend rejects them
// (see WA_Backend/middlewares/honeypot.js). The parent form needs `relative`.
export default function HoneypotField({ id, value, onChange }) {
  return (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <label htmlFor={id}>Website</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
    </div>
  );
}
