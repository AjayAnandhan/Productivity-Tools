"use client";

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Calculator,
  QrCode,
  Clock,
  Download,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Maximize Your <span className="text-primary">Productivity</span>
          </h1>
        </div>
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Essential Tools for Modern Professionals
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Everything you need to stay organized and efficient, all in one
                place.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Timesheet Calculator Card */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">
                    Timesheet Calculator
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Track your work hours with precision and calculate earnings
                    automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        Flexible date ranges
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        Automatic calculations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        Print-ready timesheets
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate("timesheet")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Open Timesheet Calculator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* QR Code Generator Card */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">
                    QR Code Generator
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Create professional QR codes for any text, URL, or data
                    instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        Instant generation
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        High-quality downloads
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calculator className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        Customizable sizes
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate("qrcode")}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    Open QR Generator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </section>

      {/* Features Section */}
    </div>
  );
}
