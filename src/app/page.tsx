"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";

import {
  Search,
  MapPin,
  Home,
  Car,
  Wrench,
  PlusCircle,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";

const SHIBIN_AREAS = ["كل شبين القناطر وقراها", ...SHIBIN_VILLAGES];
