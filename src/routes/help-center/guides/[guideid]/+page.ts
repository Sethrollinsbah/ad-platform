/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
    guideId: params.guideId
  };
}
