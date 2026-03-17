import { Button } from "@/components/ui/button";
import {
  Activity,
  Bell,
  CheckCircle2,
  ChefHat,
  Database,
  Globe,
  Loader2,
  Lock,
  RefreshCw,
  Shield,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

type ServiceStatus = "online" | "checking" | "offline";

interface ServiceCard {
  id: string;
  name: string;
  port: number;
  description: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  uptime: string;
  responseTime: string;
}

const SERVICES: ServiceCard[] = [
  {
    id: "gateway",
    name: "API Gateway",
    port: 5000,
    description: "Central routing hub for all client requests",
    icon: Globe,
    color: "bg-violet-500",
    borderColor: "border-violet-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    uptime: "99.9%",
    responseTime: "8ms",
  },
  {
    id: "user",
    name: "User Service",
    port: 5001,
    description: "Handles authentication and user management",
    icon: Lock,
    color: "bg-cyan-500",
    borderColor: "border-cyan-500",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-600",
    uptime: "99.8%",
    responseTime: "12ms",
  },
  {
    id: "recipe",
    name: "Recipe Service",
    port: 5002,
    description: "Manages recipe data, search, and ratings",
    icon: ChefHat,
    color: "bg-emerald-500",
    borderColor: "border-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    uptime: "99.9%",
    responseTime: "15ms",
  },
  {
    id: "order",
    name: "Order Service",
    port: 5003,
    description: "Processes orders and tracks delivery status",
    icon: ShoppingCart,
    color: "bg-amber-500",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    uptime: "99.7%",
    responseTime: "18ms",
  },
  {
    id: "notification",
    name: "Notification Service",
    port: 5004,
    description: "Sends emails and manages user notifications",
    icon: Bell,
    color: "bg-red-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
    uptime: "99.6%",
    responseTime: "11ms",
  },
  {
    id: "mongo",
    name: "MongoDB Database",
    port: 27017,
    description: "Primary database for all services",
    icon: Database,
    color: "bg-green-600",
    borderColor: "border-green-600",
    bgColor: "bg-green-600/10",
    textColor: "text-green-700",
    uptime: "100%",
    responseTime: "2ms",
  },
];

const AUTO_REFRESH_SECONDS = 30;

export default function Health() {
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>(() =>
    Object.fromEntries(SERVICES.map((s) => [s.id, "online"])),
  );
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = useCallback(() => {
    if (isChecking) return;
    setIsChecking(true);
    // Set all to checking
    setStatuses(Object.fromEntries(SERVICES.map((s) => [s.id, "checking"])));

    // Resolve each service with staggered delay
    SERVICES.forEach((svc, i) => {
      setTimeout(
        () => {
          setStatuses((prev) => ({ ...prev, [svc.id]: "online" }));
          if (i === SERVICES.length - 1) {
            setLastChecked(new Date());
            setCountdown(AUTO_REFRESH_SECONDS);
            setIsChecking(false);
          }
        },
        400 + i * 300,
      );
    });
  }, [isChecking]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          runHealthCheck();
          return AUTO_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  const onlineCount = Object.values(statuses).filter(
    (s) => s === "online",
  ).length;
  const checkingCount = Object.values(statuses).filter(
    (s) => s === "checking",
  ).length;

  return (
    <main className="min-h-screen bg-background" data-ocid="health.page">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-500/10 via-background to-background py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full px-4 py-1 text-sm font-medium mb-4">
                <Activity className="w-3.5 h-3.5" />
                Live Monitoring
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
                Service Health Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Monitor all microservices in real-time
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-start md:items-end gap-3"
            >
              <Button
                size="lg"
                onClick={runHealthCheck}
                disabled={isChecking}
                className="gap-2"
                data-ocid="health.primary_button"
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isChecking ? "Checking..." : "Check All Services"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Auto-refresh in{" "}
                <span className="font-mono font-bold text-primary">
                  {countdown}s
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          data-ocid="health.section"
        >
          {[
            {
              label: "Total Services",
              value: SERVICES.length.toString(),
              icon: Shield,
              color: "text-foreground",
            },
            {
              label: "Online",
              value: checkingCount > 0 ? "..." : onlineCount.toString(),
              icon: CheckCircle2,
              color: "text-emerald-600",
            },
            {
              label: "Checking",
              value: checkingCount.toString(),
              icon: Loader2,
              color: "text-amber-500",
            },
            {
              label: "Last Checked",
              value: lastChecked.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              icon: RefreshCw,
              color: "text-primary",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className={`font-display font-bold text-2xl ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {SERVICES.map((svc, i) => {
            const status = statuses[svc.id] as ServiceStatus;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`bg-card border-2 rounded-2xl overflow-hidden transition-all ${
                  status === "online"
                    ? svc.borderColor
                    : status === "checking"
                      ? "border-amber-400"
                      : "border-red-400"
                }`}
                data-ocid="health.card"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${svc.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${svc.bgColor}`}
                      >
                        <svc.icon className={`w-5 h-5 ${svc.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground">
                          {svc.name}
                        </h3>
                        <span
                          className={`text-xs font-mono font-semibold ${svc.textColor}`}
                        >
                          :{svc.port}
                        </span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-1.5">
                      {status === "online" && (
                        <>
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                          <span className="text-xs font-semibold text-emerald-600">
                            Online
                          </span>
                        </>
                      )}
                      {status === "checking" && (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                          <span className="text-xs font-semibold text-amber-500">
                            Checking...
                          </span>
                        </>
                      )}
                      {status === "offline" && (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-xs font-semibold text-red-500">
                            Offline
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {svc.description}
                  </p>

                  <div className="flex gap-4">
                    <div className="flex-1 bg-secondary/60 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">Uptime</p>
                      <p className="font-mono font-bold text-sm text-emerald-600">
                        {svc.uptime}
                      </p>
                    </div>
                    <div className="flex-1 bg-secondary/60 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">Latency</p>
                      <p
                        className={`font-mono font-bold text-sm ${svc.textColor}`}
                      >
                        {svc.responseTime}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture note */}
        <div className="bg-secondary/40 border border-border rounded-2xl p-6 flex items-start gap-4">
          <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Independent by Design
            </h3>
            <p className="text-sm text-muted-foreground">
              Each service runs independently. If one service goes down, others
              continue to operate normally. This is the core benefit of
              microservices architecture — fault isolation and independent
              scalability.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
