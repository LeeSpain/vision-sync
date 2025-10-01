import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { Activity, TrendingUp, Users, DollarSign, MousePointer, Clock, Target, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnalyticsSeedButton from './AnalyticsSeedButton';

export function RealTimeAnalytics() {
  const {
    liveMetrics,
    conversionFunnel,
    pageViews,
    revenueMetrics,
    userBehavior,
    projectPerformance,
    loading,
    lastUpdate,
    isLive
  } = useRealTimeAnalytics();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading analytics data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Live Status */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight">Real-Time Analytics</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isLive ? 'bg-emerald-green' : 'bg-coral-orange'}`}></div>
              <Badge variant={isLive ? "default" : "secondary"} className="text-xs">
                {isLive ? "LIVE" : "RECONNECTING"}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Live business intelligence and performance metrics
            {lastUpdate && (
              <span className="block text-xs text-cool-gray mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <AnalyticsSeedButton />
      </div>

      {/* Live Metrics Overview with Real-time Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="animate-pulse">LIVE</Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {liveMetrics.conversionRateChange > 0 ? '+' : ''}{liveMetrics.conversionRateChange}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${liveMetrics.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {liveMetrics.leads} new leads today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMetrics.avgSessionTime}s</div>
            <p className="text-xs text-muted-foreground">
              {liveMetrics.bounceRate}% bounce rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Page Views (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={pageViews}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userBehavior.trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userBehavior.trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehavior.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{page.path}</p>
                      <p className="text-sm text-muted-foreground">{page.views} views</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Avg Time: </span>
                        <span className="font-medium">{page.avgTime}s</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Conversions: </span>
                        <span className="font-medium">{page.conversions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userBehavior.sessionDuration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userBehavior.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userBehavior.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                User Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pages per Session</p>
                  <p className="text-2xl font-bold">{userBehavior.pagesPerSession}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Scroll Depth</p>
                  <p className="text-2xl font-bold">{userBehavior.avgScrollDepth}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interactions per Session</p>
                  <p className="text-2xl font-bold">{userBehavior.interactionsPerSession}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={conversionFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="hsl(var(--primary))" name="Users" />
                  <Bar dataKey="conversions" fill="hsl(var(--accent))" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">{stage.rate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${stage.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Converting Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBehavior.topConvertingSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-muted-foreground">{source.leads} leads</p>
                      </div>
                      <Badge variant="secondary">{source.conversionRate}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab - Complete Performance Dashboard */}
        <TabsContent value="projects" className="space-y-6">
          {/* Project Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>All Projects Performance Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time metrics for all {projectPerformance.length} projects • Auto-updates when new projects are added
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={projectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
                  <Bar dataKey="inquiries" fill="hsl(var(--accent))" name="Inquiries" />
                  <Bar dataKey="conversions" fill="hsl(var(--emerald-green))" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Projects */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Performing Projects</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectPerformance.slice(0, 6).map((project, index) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-1">{project.name}</CardTitle>
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-xl font-bold">{project.views.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Inquiries</p>
                        <p className="text-xl font-bold text-primary">{project.inquiries}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Conversion Rate</span>
                        <span className="font-medium">{project.conversionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(project.conversionRate, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="font-medium">{project.engagementRate}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Avg. Time</span>
                        <span className="font-medium">{Math.floor(project.avgTimeOnPage / 60)}m {project.avgTimeOnPage % 60}s</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Bounce Rate</span>
                        <span className="font-medium">{project.bounceRate}%</span>
                      </div>
                      {project.revenue > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-medium text-emerald-green">${project.revenue.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Complete Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Project Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed performance metrics for all projects
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Project</th>
                        <th className="p-3 text-left font-medium">Category</th>
                        <th className="p-3 text-right font-medium">Views</th>
                        <th className="p-3 text-right font-medium">Inquiries</th>
                        <th className="p-3 text-right font-medium">Conv. Rate</th>
                        <th className="p-3 text-right font-medium">Interactions</th>
                        <th className="p-3 text-right font-medium">Avg. Time</th>
                        <th className="p-3 text-right font-medium">Bounce %</th>
                        <th className="p-3 text-right font-medium">Revenue</th>
                        <th className="p-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectPerformance.map((project, index) => (
                        <tr key={project.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="font-medium">{project.name}</div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {project.category}
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-medium">{project.views.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <span className="text-primary font-medium">{project.inquiries}</span>
                          </td>
                          <td className="p-3 text-right">
                            <Badge variant={project.conversionRate >= 5 ? "default" : "secondary"}>
                              {project.conversionRate}%
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-medium">{project.interactions}</td>
                          <td className="p-3 text-right text-muted-foreground">
                            {Math.floor(project.avgTimeOnPage / 60)}:{String(project.avgTimeOnPage % 60).padStart(2, '0')}
                          </td>
                          <td className="p-3 text-right">
                            <span className={project.bounceRate > 70 ? 'text-destructive' : 'text-muted-foreground'}>
                              {project.bounceRate}%
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {project.revenue > 0 ? (
                              <span className="text-emerald-green font-medium">
                                ${project.revenue.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={project.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {project.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {projectPerformance.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">No project data available yet</p>
                  <p className="text-sm text-muted-foreground">
                    Projects will appear here automatically when analytics data is collected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Categories Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Projects by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        projectPerformance.reduce((acc, p) => {
                          acc[p.category] = (acc[p.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(projectPerformance).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                    <span className="font-bold text-lg">{projectPerformance.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="font-medium">
                      {projectPerformance.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Inquiries</span>
                    <span className="font-medium text-primary">
                      {projectPerformance.reduce((sum, p) => sum + p.inquiries, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Conversions</span>
                    <span className="font-medium text-emerald-green">
                      {projectPerformance.reduce((sum, p) => sum + p.conversions, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-medium text-emerald-green">
                      ${projectPerformance.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Avg. Conversion Rate</span>
                    <span className="font-medium">
                      {projectPerformance.length > 0
                        ? Math.round(
                            projectPerformance.reduce((sum, p) => sum + p.conversionRate, 0) /
                              projectPerformance.length
                          )
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Engagement Rate</span>
                    <span className="font-medium">
                      {projectPerformance.length > 0
                        ? Math.round(
                            projectPerformance.reduce((sum, p) => sum + p.engagementRate, 0) /
                              projectPerformance.length
                          )
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Pipeline Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueMetrics.pipelineValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{revenueMetrics.activeDeals} active deals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Deal Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueMetrics.avgDealSize.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{revenueMetrics.winRate}% win rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Deal Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueMetrics.dealVelocity} days</div>
                <p className="text-xs text-muted-foreground">Avg time to close</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueMetrics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="pipeline" stroke="hsl(var(--accent))" strokeWidth={2} name="Pipeline" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}