import HlsPlayer from '../components/hlsPlayer/HLSPlayer'
import withBasePage from './withBasePage';

function HlsPlayerPage() {

  return (
    <div>
      <HlsPlayer />
    </div>
  )
}

export default withBasePage(HlsPlayerPage);
