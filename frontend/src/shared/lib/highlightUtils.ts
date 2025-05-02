export function highlightMeasure(index: number) {
  const allMeasures = Array.from(document.querySelectorAll(".vf-measure"))
  const groups: Element[][] = []
  const tolerance = 10 // x좌표 기준 마디 묶음

  console.log("🧩 마디 하이라이트 시작 - 요청된 index:", index)
  console.log("🔍 .vf-measure 전체 개수:", allMeasures.length)

  // 그룹핑
  allMeasures.forEach((el) => {
    const x = (el as SVGGElement).getBBox().x
    const group = groups.find((g) => {
      const gx = (g[0] as SVGGElement).getBBox().x
      return Math.abs(gx - x) < tolerance
    })

    if (group) {
      group.push(el)
    } else {
      groups.push([el])
    }
  })

  console.log("📊 총 마디 그룹 수:", groups.length)

  // index 유효성 검사
  if (index >= groups.length) {
    console.warn(`❌ index ${index}는 유효하지 않음 (총 그룹 수: ${groups.length})`)
    return
  }

  // 기존 하이라이트 제거
  allMeasures.forEach((el) =>
    el.querySelectorAll(".highlight-bg").forEach((n) => n.remove())
  )

  const targetGroup = groups[index]
  console.log(`🟡 하이라이트 그룹 ${index}의 마디 수: ${targetGroup.length}`)

  targetGroup.forEach((el, i) => {
    const bbox = (el as SVGGElement).getBBox()
    console.log(
      `  ▸ 마디 ${i}: x=${bbox.x.toFixed(1)}, y=${bbox.y.toFixed(1)}, w=${bbox.width.toFixed(1)}, h=${bbox.height.toFixed(1)}`
    )

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    rect.setAttribute("x", `${bbox.x}`)
    rect.setAttribute("y", `${bbox.y}`)
    rect.setAttribute("width", `${bbox.width}`)
    rect.setAttribute("height", `${bbox.height}`)
    rect.setAttribute("fill", "#ffeaa7")
    rect.setAttribute("opacity", "0.4")
    rect.setAttribute("rx", "4")
    rect.setAttribute("class", "highlight-bg")
    el.insertBefore(rect, el.firstChild)
  })
}
