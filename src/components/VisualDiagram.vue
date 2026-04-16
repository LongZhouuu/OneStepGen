<template>
    <section class="labourComparision card shadow-sm border-0 p-4">
        <div class="row align-items-end g-3 mb-4">
            <div class="col-md-4">
                <label for="age-select" class="form-label fw-semibold">Select age group</label>
                <select id="age-select" v-model="selectedAge" class="form-select">
                    <option v-for="option in ageOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

            <div class="col-md-8 text-md-end">
                Swipe or click arrows to view different charts
            </div>
        </div>

        <div id="labourChartCarousel" class="carousel slide" data-bs-interval="false">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="chart-page">
                        <div ref="barChartRef" class="chart-box"></div>
                    </div>
                </div>

                <div class="carousel-item">
                    <div class="chart-page">
                        <div ref="pieChartRef" class="chart-box pie-chart-box"></div>
                    </div>
                </div>
            </div>

            <button class="carousel-control-prev custom-control" type="button" data-bs-target="#labourChartCarousel"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>

            <button class="carousel-control-next custom-control" type="button" data-bs-target="#labourChartCarousel"
                data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>

        <a class="source-text mt-4 mb-0" href="https://www.abs.gov.au/" target="_blank">
            Source: Australian Bureau of Statistics, Disability, Ageing and Carers, Australia:
            Disability and the Labour Force, Table 1.3. Percentages are taken directly
            from the source table and may show minor rounding differences.
        </a>
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartData = ref(null)

const ageOptions = [
    '15–24',
    '25–34',
    '35–44',
    '45–54',
    '55–64',
    '65 and over'
]

const selectedAge = ref('25–34')

const metricLabels = [
    'Employed full-time',
    'Employed part-time',
    'Underemployed',
    'Total employed',
    'Unemployed',
    'Total in labour force',
    'Not in labour force'
]

const barChartRef = ref(null)
const pieChartRef = ref(null)

let barChartInstance = null
let pieChartInstance = null
let carouselElement = null

function getSelectedData() {
    return chartData.value?.[selectedAge.value]
}

function renderBarChart() {
    if (!barChartRef.value || !barChartInstance) return

    const data = getSelectedData()
    if (!data) return

    const withDisabilityValues = [
        data.withDisability.fullTime,
        data.withDisability.partTime,
        data.withDisability.underemployed,
        data.withDisability.totalEmployed,
        data.withDisability.unemployed,
        data.withDisability.totalInLabourForce,
        data.withDisability.notInLabourForce
    ]

    const noDisabilityValues = [
        data.noDisability.fullTime,
        data.noDisability.partTime,
        data.noDisability.underemployed,
        data.noDisability.totalEmployed,
        data.noDisability.unemployed,
        data.noDisability.totalInLabourForce,
        data.noDisability.notInLabourForce
    ]

    const option = {
        title: {
            text: `Employment rate of the ${selectedAge.value} age group`,
            left: 'center',
            top: 16,
            textStyle: {
                fontSize: 16,
                fontWeight: 700,
                color: '#374151'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter(params) {
                const lines = [`${params[0].name}`]
                params.forEach(item => {
                    lines.push(`${item.seriesName}: ${item.value}%`)
                })
                return lines.join('<br/>')
            }
        },
        legend: {
            top: 48,
            data: ['With disability', 'No disability'],
            textStyle: {
                color: '#4b5563'
            }
        },
        grid: {
            top: 95,
            left: 140,
            right: 36,
            bottom: 36
        },
        xAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        yAxis: {
            type: 'category',
            data: metricLabels
        },
        series: [
            {
                name: 'With disability',
                type: 'bar',
                data: withDisabilityValues,
                itemStyle: {
                    color: '#5b6fd8'
                }
            },
            {
                name: 'No disability',
                type: 'bar',
                data: noDisabilityValues,
                itemStyle: {
                    color: '#b7d323'
                }
            }
        ]
    }

    barChartInstance.setOption(option, true)
}

function renderPieChart() {
    if (!pieChartRef.value || !pieChartInstance) return

    const data = getSelectedData()
    if (!data) return

    const option = {
        title: [
            {
                text: `Employment rate of the ${selectedAge.value} age group`,
                left: 'center',
                top: 16,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#374151'
                }
            },
            {
                text: 'With disability',
                left: 'center',
                top: "12%",
                textStyle: {
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#4b5563'
                }
            },
            {
                text: 'No disability',
                left: 'center',
                top: "52%",
                textStyle: {
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#4b5563'
                }
            }
        ],
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}%'
        },
        series: [
            {
                name: 'With disability',
                type: 'pie',
                radius: ['18%', '28%'],
                center: ['50%', '32%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b} {c}%',
                    fontSize: 10
                },
                labelLine: {
                    length: 8,
                    length2: 10
                },
                data: [
                    { value: data.withDisability.totalInLabourForce, name: 'In labour force' },
                    { value: data.withDisability.notInLabourForce, name: 'Not in labour force' }
                ]
            },
            {
                name: 'No disability',
                type: 'pie',
                radius: ['18%', '28%'],
                center: ['50%', '74%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b} {c}%',
                    fontSize: 10
                },
                labelLine: {
                    length: 8,
                    length2: 10
                },
                data: [
                    { value: data.noDisability.totalInLabourForce, name: 'In labour force' },
                    { value: data.noDisability.notInLabourForce, name: 'Not in labour force' }
                ]
            }
        ],
        color: ['#5b6fd8', '#b7d323']
    }

    pieChartInstance.setOption(option, true)
}

function renderCharts() {
    renderBarChart()
    renderPieChart()
}

function handleResize() {
    if (barChartInstance) barChartInstance.resize()
    if (pieChartInstance) pieChartInstance.resize()
}

function handleCarouselSlide() {
    setTimeout(() => {
        handleResize()
    }, 350)
}

onMounted(async () => {
    if (barChartRef.value) {
        barChartInstance = echarts.init(barChartRef.value)
    }

    if (pieChartRef.value) {
        pieChartInstance = echarts.init(pieChartRef.value)
    }

    const res = await fetch('/data/employmentDisability.json')
    chartData.value = await res.json()

    await nextTick()
    renderCharts()

    window.addEventListener('resize', handleResize)

    carouselElement = document.getElementById('labourChartCarousel')
    if (carouselElement) {
        carouselElement.addEventListener('slid.bs.carousel', handleCarouselSlide)
    }
})

watch(selectedAge, async () => {
    if (!chartData.value) return
    await nextTick()
    renderCharts()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)

    if (carouselElement) {
        carouselElement.removeEventListener('slid.bs.carousel', handleCarouselSlide)
    }

    if (barChartInstance) {
        barChartInstance.dispose()
        barChartInstance = null
    }

    if (pieChartInstance) {
        pieChartInstance.dispose()
        pieChartInstance = null
    }
})
</script>

<style scoped>
.labourComparision {
    max-width: 1040px;
    margin: 0 auto;
    border-radius: 18px;
    background: #ffffff;
    padding: 0;
}

.chart-page {
    padding: 4px 50px 4px;
}

.chart-box {
    width: 100%;
    height: 400px;
    background: #fbfbfc;
    border-radius: 18px;
}

.chart-hint {
    font-size: 0.9rem;
    color: #8b95a7;
}

.source-text {
    font-size: 0.84rem;
    color: #7b8190;
    line-height: 1.6;
    text-align: center;
}

.custom-control {
    width: 44px;
    opacity: 1;
}

.custom-control .carousel-control-prev-icon,
.custom-control .carousel-control-next-icon {
    width: 2.2rem;
    height: 2.2rem;
    background-color: rgba(55, 65, 81, 0.32);
    border-radius: 50%;
    background-size: 48% 48%;
    transition: 0.2s ease;
}

.custom-control:hover .carousel-control-prev-icon,
.custom-control:hover .carousel-control-next-icon {
    background-color: rgba(55, 65, 81, 0.5);
}
</style>