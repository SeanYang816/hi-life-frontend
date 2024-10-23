import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { apiGetThingsTopology } from 'api' // Your actual API call
import { Tooltip, Checkbox, FormControlLabel, FormGroup, Box, Grid  } from '@mui/material'

// Define types for device and hierarchical structure
export type ThingsTopologyType = {
  macAddress: string;
  groupID: number;
  groupName: string;
  ip: string;
  storeName: string;
  isOnline: boolean; // New property to reflect the device's status
}

interface DeviceNode {
  name: string;
  macAddress: string;
  storeName: string;
  isOnline: boolean; // Reflect device's online/offline status
}

interface StoreNode {
  name: string;
  children: DeviceNode[];
  isExpanded: boolean;
}

interface GroupNode {
  name: string;
  children: StoreNode[];
  isExpanded: boolean;
}

interface Hierarchy {
  name: string;
  children: GroupNode[];
}

// Utility function to convert an IP address to a number for sorting
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc: number, octet: string) => (acc << 8) | parseInt(octet), 0)
}

// Function to transform the flat data into a hierarchical structure with sorted IPs
function buildHierarchy(data: ThingsTopologyType[], sortOrder: 'asc' | 'desc' = 'asc'): Hierarchy {
  const root: Hierarchy = { name: '', children: [] }

  data.forEach((device) => {
    // First find or create a group node
    let groupNode = root.children.find((child) => child.name === device.groupName)
    if (!groupNode) {
      groupNode = {
        name: device.groupName,
        children: [],
        isExpanded: true
      }
      root.children.push(groupNode)
    }

    // Then find or create a store node under the group
    let storeNode = groupNode.children.find((child) => child.name === device.storeName)
    if (!storeNode) {
      storeNode = {
        name: device.storeName,
        children: [],
        isExpanded: false
      }
      groupNode.children.push(storeNode)
    }

    // Finally, add the device (IP) node under the store
    const deviceNode: DeviceNode = {
      name: device.ip,
      macAddress: device.macAddress,
      storeName: device.storeName,
      isOnline: device.isOnline // Assign isOnline status
    }

    storeNode.children.push(deviceNode)
  })

  // Sort the IPs in either ascending or descending order within each store
  root.children.forEach((group) => {
    group.children.forEach((store) => {
      store.children.sort((a, b) => {
        const comparison = ipToNumber(a.name) - ipToNumber(b.name)
        return sortOrder === 'asc' ? comparison : -comparison
      })
    })
  })

  return root
}

const GroupChart = ({ group, sortOrder }: { group: GroupNode; sortOrder?: 'asc' | 'desc' }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [tooltip, setTooltip] = useState<{
    content: string
    position: { x: number; y: number }
    visible: boolean
  }>({
    content: '',
    position: { x: 0, y: 0 },
    visible: false
  })

  const renderTree = useCallback(
    (groupData: GroupNode) => {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const root = d3.hierarchy(groupData)
      const totalNodes = root.descendants().length
      const nodeHeight = 20
      const dynamicHeight = Math.max(totalNodes * nodeHeight, 400)

      const width = svgRef.current?.clientWidth || 800
      const padding = 40
      const treeLayout = d3.tree().size([dynamicHeight, width - padding * 2])
      treeLayout(root)

      const g = svg
        .attr('viewBox', `0 0 ${width + padding} ${dynamicHeight + padding}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${padding},${padding / 2})`)

      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x((d) => d.y).y((d) => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#ccc')

      const node = g
        .selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .on('mouseover', (event, d) => {
          let tooltipContent = ''
          if (d.depth === 1) {
            // Store level
            tooltipContent = `<strong>Store: ${d.data.name}</strong><br/>Devices: ${d.data.children.length}`
          } else if (d.depth === 2) {
            // Device level
            tooltipContent = `<strong>IP: ${d.data.name}</strong><br/>MAC: ${d.data.macAddress}<br/>Store: ${d.data.storeName}<br/>Status: ${d.data.isOnline ? 'Online' : 'Offline'}`
          }

          const svgRect = svgRef.current!.getBoundingClientRect()
          setTooltip({
            content: tooltipContent,
            position: { x: event.clientX - svgRect.left, y: event.clientY - svgRect.top },
            visible: true
          })
        })
        .on('mousemove', (event) => {
          const svgRect = svgRef.current!.getBoundingClientRect()
          setTooltip((prev) => ({
            ...prev,
            position: { x: event.clientX - svgRect.left, y: event.clientY - svgRect.top }
          }))
        })
        .on('mouseout', () => {
          setTooltip((prev) => ({ ...prev, visible: false }))
        })

      // Circle color logic for group, store, and device levels
      node
        .append('circle')
        .attr('r', 6)
        .attr('fill', (d) => {
          if (d.depth === 0) {
            // Group level
            return 'white'
          } else if (d.depth === 1) {
            // Store level
            return 'white'
          } else if (d.depth === 2) {
            // Device level
            return d.data.isOnline ? 'green' : 'red'
          }
        })
        .attr('stroke', (d) => {
          if (d.depth === 0 || d.depth === 1) {
            // Group and store level border color
            return '#40a9ff'
          }
          return 'none'
        })
        .attr('stroke-width', (d) => (d.depth === 0 || d.depth === 1 ? 2 : 0))

      node
        .append('text')
        .attr('dy', 3)
        .attr('x', (d) => (d.children ? -10 : 10))
        .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text((d) => d.data.name)
        .style('font-size', '12px')
    },
    [sortOrder]
  )

  useEffect(() => {
    if (group) {
      renderTree(group)
    }
  }, [group, renderTree])

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '20px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      {tooltip.visible && (
        <Tooltip
          title={<span dangerouslySetInnerHTML={{ __html: tooltip.content }} />}
          open={true}
          placement='top'
          style={{
            position: 'absolute',
            top: tooltip.position.y,
            left: tooltip.position.x,
            pointerEvents: 'none'
          }}
        >
          <div />
        </Tooltip>
      )}
    </div>
  )
}

export const TopologyChart = ({ sortOrder = 'asc' }: { sortOrder?: 'asc' | 'desc' }) => {
  const [data, setData] = useState<Hierarchy | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]) // Track selected groups

  // Fetch data and initialize selected groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetThingsTopology([]) // Pass appropriate params here
        const hierarchyData = buildHierarchy(response, sortOrder)
        setData(hierarchyData)
        // Initialize selected groups (all groups selected by default)
        const allGroups = hierarchyData.children.map((group) => group.name)
        setSelectedGroups(allGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [sortOrder])

  // Toggle selected group
  const toggleGroup = (groupName: string) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(groupName)
        ? prevSelectedGroups.filter((group) => group !== groupName)
        : [...prevSelectedGroups, groupName]
    )
  }

  return (
    <Box display='flex'>
      <Box
        mt={2}
        mr={2}
        sx={{
          position: 'sticky',  // Make the sidebar sticky
          top: 0,  // Stick it to the top of the page when scrolling
          alignSelf: 'flex-start',  // Ensure it aligns with the start of the container
          maxHeight: '100vh',  // Make sure it doesn’t go beyond the viewport height
          overflowY: 'auto',  // Allow scrolling inside the box
          '&::-webkit-scrollbar': { width: 0, height: 0 },  // Hide scrollbar by default
          '&:hover': { '&::-webkit-scrollbar': { width: '6px', height: '6px' } },  // Show scrollbar on hover
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },  // Style for scrollbar thumb
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }  // Style on hover for scrollbar thumb
        }}
      >
        {/* Checkboxes for group selection */}
        <FormGroup>
          {data?.children.map((group) => (
            <FormControlLabel
              key={group.name}
              control={
                <Checkbox
                  checked={selectedGroups.includes(group.name)}
                  onChange={() => toggleGroup(group.name)}
                />
              }
              label={group.name}
            />
          ))}
        </FormGroup>
      </Box>

      <Box flex={1}>
        <Grid container spacing={2}>
          {/* Render a chart for each selected group */}
          {data?.children
            .filter((group) => selectedGroups.includes(group.name))
            .map((group) => (
              <Grid item xs={12} md={6} key={group.name}>
                <GroupChart group={group} sortOrder={sortOrder} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  )

}

export const App = () => {
  return <TreeDiagram sortOrder='asc' />
}
