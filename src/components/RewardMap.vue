<template>
  <!-- Map section -->
  <div class="map-wrapper">
    <!-- SVG must always exist so D3 can render onMounted -->
    <svg
      ref="mapSvg"
      class="australia-map"
      :viewBox="`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Map of Australia"
    ></svg>

    <!-- Loading/error overlays -->
    <div v-if="isLoading" class="map-overlay map-loading" aria-live="polite">
      <span>Loading map...</span>
    </div>
    <div v-else-if="error" class="map-overlay map-error" role="alert">
      <span>{{ error }}</span>
    </div>

    <!-- Tooltip — appears above the hovered animal pin -->
    <div
      v-if="tooltip.visible"
      class="animal-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>
  </div>

  <!-- Modal — overlays the full page when a pin is clicked -->
  <div
    v-if="modal.open"
    class="modal-overlay"
    @click.self="modal.open = false"
  >
    <div class="modal-card">
      <button class="modal-close" @click="modal.open = false">✕</button>

      <!-- Locked state -->
      <div v-if="!modal.unlocked" class="modal-locked">
        <img :src="modal.image" class="modal-img modal-img-locked" alt="Locked animal" />
        <p class="modal-hint">{{ modal.hint }}</p>
        <p class="modal-sub">Complete more sessions to unlock</p>
      </div>

      <!-- Unlocked state -->
      <div v-else class="modal-unlocked">
        <img :src="modal.image" class="modal-img" :alt="modal.name" />
        <h2 class="modal-name">{{ modal.name }}</h2>
        <p class="modal-region">📍 {{ modal.region }}</p>
        <p class="modal-desc">{{ modal.description }}</p>
        <div class="modal-fact">⚡ {{ modal.funFact }}</div>
        <div v-if="modal.count > 1" class="modal-count">Collected x{{ modal.count }}</div>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { mesh } from 'topojson-client'
import { topology } from 'topojson-server'
import { ANIMALS } from '@/data/animals.js'
import { getRewards } from '@/router/workflow.js'
 
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
 
/** SVG canvas dimensions in pixels. The viewBox uses these values so the map
 *  scales responsively via CSS without re-rendering. */
// Larger internal canvas so we have room to place markers/content on top
const MAP_WIDTH = 1120
const MAP_HEIGHT = 860

// Leave extra "ocean" margin inside the SVG so the background frame
// looks roomier (and gives space for future overlays/markers).
const MAP_PADDING = 32
 
/** Visual style constants — kept here so they are easy to update in one place */
const COLORS = {
  /** Fill colour for every state/territory polygon */
  stateFill: '#E8D5BC',
 
  /** Border colour between states */
  stateBorder: '#C4A882',
 
  /** Colour for state/territory name labels */
  labelText: '#8B6340',
 
  /** Background rectangle behind the map (represents the ocean) */
  oceanBackground: '#F5EDE0',
}
 
/** URL to the GeoJSON file stored in /public/data/
 *  The file should contain Australian state/territory boundaries.
 *  Recommended source: https://github.com/tonywr71/GeoJson-Data */
const GEO_JSON_URL = '/data/australia.json'
 
/** Approximate geographic centre of each state/territory for label placement.
 *  Using fixed coordinates gives more predictable label positions than
 *  relying on D3's centroid calculation, which can be thrown off by
 *  irregular shapes (e.g. South Australia's notch). */
const STATE_LABEL_POSITIONS = {
  'Western Australia':        { lng: 121.6, lat: -26.5 },
  'Northern Territory':       { lng: 133.4, lat: -19.5 },
  'South Australia':          { lng: 135.5, lat: -30.0 },
  'Queensland':               { lng: 144.5, lat: -22.5 },
  'New South Wales':          { lng: 146.5, lat: -32.5 },
  'Victoria':                 { lng: 144.5, lat: -37.0 },
  'Tasmania':                 { lng: 146.5, lat: -42.0 },
  'Australian Capital Territory': { lng: 149.1, lat: -35.5 },
}
 
/** Abbreviated labels rendered on the map instead of full state names */
const STATE_ABBREVIATIONS = {
  'Western Australia':            'WA',
  'Northern Territory':           'NT',
  'South Australia':              'SA',
  'Queensland':                   'QLD',
  'New South Wales':              'NSW',
  'Victoria':                     'VIC',
  'Tasmania':                     'TAS',
  'Australian Capital Territory': 'ACT',
}
 
// ---------------------------------------------------------------------------
// Reactive state
// ---------------------------------------------------------------------------
 
/** Template ref bound to the <svg> element */
const mapSvg = ref(null)
 
/** True while the GeoJSON file is being fetched */
const isLoading = ref(true)
 
/** Holds an error message string if the fetch or render fails, otherwise null */
const error = ref(null)

// Tooltip state
const tooltip = ref({ visible: false, x: 0, y: 0, text: '' })

// Modal state
const modal = ref({
  open: false, unlocked: false,
  name: '', region: '', image: '',
  hint: '', description: '', funFact: '', count: 0,
})

// ---------------------------------------------------------------------------
// Map rendering
// ---------------------------------------------------------------------------
 
/**
 * Renders one circular image pin per animal onto the SVG.
 * Called after renderMap() creates the projection.
 * @param {Function} projection - D3 projection (lng, lat) → [x, y]
 */
function renderAnimalPins(projection) {
  const rewards = getRewards()
  const svg = d3.select(mapSvg.value)
  const mapWrapper = document.querySelector('.map-wrapper')
  const PIN_SIZE = 44

  ANIMALS.forEach(animal => {
    const count = rewards.filter(r => r.name === animal.id).length
    const unlocked = count > 0
    const [x, y] = projection([animal.lng, animal.lat])
    const half = PIN_SIZE / 2

    // foreignObject lets us use border-radius on the image inside SVG
    const fo = svg
      .append('foreignObject')
      .attr('x', x - half)
      .attr('y', y - half)
      .attr('width', PIN_SIZE)
      .attr('height', PIN_SIZE)
      .style('cursor', 'pointer')
      .style('overflow', 'visible')

    fo.append('xhtml:img')
      .attr('src', animal.image)
      .attr('width', PIN_SIZE)
      .attr('height', PIN_SIZE)
      .style('border-radius', '50%')
      .style('border', '2.5px solid #C4A882')
      .style('object-fit', 'cover')
      .style('object-position', 'center top')
      .style('display', 'block')
      .style('box-shadow', '0 2px 8px rgba(40,20,0,0.22)')
      .style('filter', unlocked ? 'none' : 'grayscale(1) brightness(0.65)')

    // Hover — show tooltip
    fo.on('mouseenter', () => {
      const svgRect = mapSvg.value.getBoundingClientRect()
      const wrapperRect = mapWrapper.getBoundingClientRect()
      const scaleX = svgRect.width / MAP_WIDTH
      const scaleY = svgRect.height / MAP_HEIGHT
      tooltip.value = {
        visible: true,
        x: (svgRect.left - wrapperRect.left) + x * scaleX,
        y: (svgRect.top - wrapperRect.top) + y * scaleY - half - 14,
        text: unlocked ? `${animal.name} — ${animal.region}` : animal.hint,
      }
    })
    fo.on('mouseleave', () => { tooltip.value.visible = false })

    // Click — open modal
    fo.on('click', () => {
      tooltip.value.visible = false
      modal.value = {
        open: true, unlocked,
        name: animal.name, region: animal.region,
        image: animal.image, hint: animal.hint,
        description: animal.description, funFact: animal.funFact,
        count,
      }
    })
  })
}

/**
 * Fetches the GeoJSON data from /public/data/australia.json and renders
 * the map into the <svg> element using D3.
 *
 * Steps:
 *  1. Fetch and parse the GeoJSON file
 *  2. Create a Mercator projection fitted to the SVG canvas size
 *  3. Draw one <path> element per state/territory
 *  4. Add abbreviated state name labels
 */
async function renderMap() {
  try {
    // If we ever re-render, clear previous drawings
    d3.select(mapSvg.value).selectAll('*').remove()

    // -- Step 1: Fetch GeoJSON -------------------------------------------
    const response = await fetch(GEO_JSON_URL)
    if (!response.ok) {
      throw new Error(`Failed to load map data (HTTP ${response.status})`)
    }
    const geoData = await response.json()
 
    // -- Step 2: Set up D3 projection ------------------------------------
    // geoMercator projects spherical (lng, lat) coordinates onto a flat plane.
    // fitExtent() fits the map into an inset box, leaving padding around it.
    const projection = d3
      .geoMercator()
      .fitExtent(
        [[MAP_PADDING, MAP_PADDING], [MAP_WIDTH - MAP_PADDING, MAP_HEIGHT - MAP_PADDING]],
        geoData,
      )
 
    // geoPath() converts GeoJSON geometry into SVG path "d" attribute strings
    const pathGenerator = d3.geoPath().projection(projection)
 
    // -- Step 3: Select SVG and draw background -------------------------
    const svg = d3.select(mapSvg.value)
 
    // Ocean background rectangle — sits behind all state polygons
    svg
      .append('rect')
      .attr('width', MAP_WIDTH)
      .attr('height', MAP_HEIGHT)
      .attr('fill', COLORS.oceanBackground)
      .attr('rx', 12) // rounded corners to match the site's card style
 
    // -- Step 4: Draw state fills (no per-state stroke) ------------------
    svg
      .append('g')
      .attr('class', 'state-fills')
      .selectAll('path.state')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', d => {
        const name = d.properties.STATE_NAME || d.properties.name || ''
        return `state state-${name.toLowerCase().replace(/\s+/g, '-')}`
      })
      .attr('d', pathGenerator)
      .attr('fill', COLORS.stateFill)
      // Overpaint tiny seams between adjacent fills (anti-aliasing / mismatched borders)
      .attr('stroke', COLORS.stateFill)
      .attr('stroke-width', 1.6)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .on('mouseenter', function () {
        d3.select(this).attr('fill', '#DEC9A8')
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', COLORS.stateFill)
      })

    // -- Step 5: Render borders as ONE path each (TopoJSON mesh) ----------
    // Convert GeoJSON -> TopoJSON, then build meshes.
    // Using meshes avoids "double-stroking" shared borders.
    const topo = topology({ states: geoData })
    // Internal state borders only (shared edges between different states).
    // This avoids any outer outline (coastline) and prevents the "eraser band" artifact.
    const borders = mesh(topo, topo.objects.states, (a, b) => a !== b)

    svg
      .append('path')
      .attr('class', 'state-borders')
      .attr('d', pathGenerator(borders))
      .attr('fill', 'none')
      .attr('stroke', COLORS.stateBorder)
      .attr('stroke-width', 1.3)
      .attr('stroke-opacity', 0.9)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')

    // Fallback outlines: if some shared borders are not topologically identical
    // in the source GeoJSON, mesh() can't produce those segments. A faint per-state
    // outline makes sure "missing" borders still appear without looking too thick.
    svg
      .append('g')
      .attr('class', 'state-outline-fallback')
      .selectAll('path.outline')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'outline')
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', COLORS.stateBorder)
      .attr('stroke-width', 1.0)
      .attr('stroke-opacity', 0.35)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')

    // -- Step 6: Add state abbreviation labels --------------------------
    geoData.features.forEach(feature => {
      // Look up the state name from whichever property the GeoJSON uses
      const stateName = feature.properties.STATE_NAME || feature.properties.name || ''
      const abbreviation = STATE_ABBREVIATIONS[stateName]
      const position = STATE_LABEL_POSITIONS[stateName]
 
      // Skip if we don't have label data for this feature
      if (!abbreviation || !position) return
 
      // Convert geographic coordinates to SVG pixel coordinates
      const [x, y] = projection([position.lng, position.lat])
 
      svg
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', COLORS.labelText)
        .attr('font-size', stateName === 'Australian Capital Territory' ? '7' : '11')
        .attr('font-family', 'inherit')
        .attr('font-weight', '500')
        .attr('pointer-events', 'none') // labels should not block mouse events on paths
        .text(abbreviation)
    })

    // -- Step 7: Render animal pins -----------------------------------------
    renderAnimalPins(projection)

  } catch (err) {
    // Surface the error message in the template so the user sees feedback
    error.value = `Could not load the map. Please try refreshing the page. (${err.message})`
    console.error('[RewardMap] renderMap error:', err)
  } finally {
    isLoading.value = false
  }
}
 
// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
 
/**
 * onMounted runs after Vue has inserted the component into the DOM,
 * which means the <svg> element referenced by mapSvg is available.
 * We call renderMap() here rather than in setup() for this reason.
 */
onMounted(() => {
  // Ensure the <svg> exists before D3 uses the ref
  nextTick(() => renderMap())
})
</script>
 
<style scoped>
/* -------------------------------------------------------------------------
   Map container
   ------------------------------------------------------------------------- */
 
.map-wrapper {
  position: relative;
  width: 100%;
  max-width: 1120px;
  background: #fdf5e6;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(100, 60, 10, 0.10);
}
 
/* The SVG scales responsively — width 100% lets it fill the container
   while the viewBox maintains the correct aspect ratio */
.australia-map {
  width: 100%;
  height: auto;
  display: block;
}
 
/* -------------------------------------------------------------------------
   Loading and error states
   ------------------------------------------------------------------------- */
 
.map-overlay {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #8b6340;
  background: rgba(253, 245, 230, 0.82);
  backdrop-filter: blur(2px);
}
 
.map-error {
  color: #b05030;
}

/* Tooltip */
.animal-tooltip {
  position: absolute;
  background: rgba(30, 16, 4, 0.88);
  color: #f5e8d0;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  pointer-events: none;
  max-width: 180px;
  line-height: 1.5;
  text-align: center;
  transform: translateX(-50%);
  z-index: 10;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 8, 2, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-card {
  background: #fdf5e6;
  border-radius: 16px;
  padding: 24px;
  max-width: 360px;
  width: 90%;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(0,0,0,0.08);
  border: none;
  border-radius: 50%;
  width: 28px; height: 28px;
  cursor: pointer;
  font-size: 14px;
  color: #5a3a10;
}
.modal-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
}
.modal-img-locked {
  filter: grayscale(1) brightness(0.6);
}
.modal-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c1a08;
  margin-bottom: 4px;
}
.modal-region {
  font-size: 12px;
  color: #c87820;
  margin-bottom: 10px;
}
.modal-desc {
  font-size: 13px;
  color: #3a2010;
  line-height: 1.7;
  margin-bottom: 10px;
}
.modal-fact {
  font-size: 12px;
  color: #7a4818;
  background: #f5e2c4;
  border-left: 3px solid #c87820;
  padding: 8px 10px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 10px;
}
.modal-count {
  font-size: 13px;
  font-weight: 500;
  color: #8b5e2a;
  text-align: center;
}
.modal-hint {
  font-size: 14px;
  color: #2c1a08;
  line-height: 1.65;
  margin-bottom: 8px;
  text-align: center;
}
.modal-sub {
  font-size: 11px;
  color: #907050;
  text-align: center;
}
</style>