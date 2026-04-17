<template>
    <section class="psychologicalDistress card shadow-sm border-0 p-4">
        <div class="row align-items-end g-3 mb-4">
            <div class="col-md-8">
                <h5 class="mb-1 fw-semibold">{{ chartData?.indicator }}</h5>
                <p class="chart-hint mb-0">
                    The proportion of people experiencing high/very high psychological distress in different years, as
                    compiled by the Australian Bureau of Statistics.
                </p>
            </div>
        </div>

        <div class="chart-page">
            <div ref="lineChartRef" class="chart-box"></div>
        </div>

        <a class="source-text mt-4 mb-0 d-block"
            href="https://www.abs.gov.au/statistics/health/health-conditions-and-risks/national-health-survey/2022"
            target="_blank">
            Source: Australian Bureau of Statistics, National Health Survey 2022,
            Table 1.3. Percentages are taken directly from the source table and may
            show minor rounding differences.
        </a>
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartData = ref(null)
const lineChartRef = ref(null)

let lineChartInstance = null

function renderLineChart() {
    if (!lineChartRef.value || !lineChartInstance || !chartData.value) return

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter(params) {
                const year = params[0]?.axisValue || ''
                const lines = [`${year}`]

                params.forEach(item => {
                    lines.push(`${item.seriesName}: ${item.value}%`)
                })

                return lines.join('<br/>')
            }
        },
        // legend: {
        //     top: 48,
        //     data: chartData.value.series.map(item => item.name),
        //     textStyle: {
        //         color: '#4b5563'
        //     }
        // },
        grid: {
            top: 95,
            left: 55,
            right: 36,
            bottom: 50
        },
        xAxis: {
            type: 'category',
            data: chartData.value.years,
            axisLine: {
                lineStyle: {
                    color: '#9ca3af'
                }
            },
            axisLabel: {
                color: '#4b5563'
            }
        },
        yAxis: {
            type: 'value',
            name: '%',
            min: 0,
            axisLine: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            },
            axisLabel: {
                formatter: '{value}%',
                color: '#4b5563'
            }
        },
        series: [
            {
                name: chartData.value.series[0].name,
                type: 'line',
                data: chartData.value.series[0].data,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#5b6fd8'
                },
                itemStyle: {
                    color: '#5b6fd8'
                }
            }
        ]
    }

    lineChartInstance.setOption(option, true)
}

function handleResize() {
    if (lineChartInstance) {
        lineChartInstance.resize()
    }
}

onMounted(async () => {
    if (lineChartRef.value) {
        lineChartInstance = echarts.init(lineChartRef.value)
    }

    const res = await fetch('/data/psychologicalDistress.json')
    chartData.value = await res.json()

    await nextTick()
    renderLineChart()

    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)

    if (lineChartInstance) {
        lineChartInstance.dispose()
        lineChartInstance = null
    }
})
</script>

<style scoped>
.psychologicalDistress {
    max-width: 100%;
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
    height: 250px;
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
    line-height: 1;
    text-align: center;
}
</style>