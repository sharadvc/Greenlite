import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { fetchApprovals, type Approval } from "@/lib/api";
import { C } from "@/lib/theme";
import { relativeTime } from "@/lib/time";

export default function ApprovalsScreen() {
  const [items, setItems] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchApprovals();
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <ActivityIndicator color={C.accent} />
        <Text style={{ color: C.muted, fontSize: 13 }}>Loading approval queue...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      style={{ backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 36, gap: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor={C.accent}
        />
      }
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 6 }}>
          <View
            style={{
              overflow: "hidden",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#31415A",
              backgroundColor: C.surface,
              padding: 18,
            }}
          >
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                borderRadius: 999,
                backgroundColor: "#17251F",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.good }} />
              <Text style={{ color: C.good, fontSize: 10, fontWeight: "800", letterSpacing: 0.8 }}>
                AGENTS LIVE
              </Text>
            </View>
            <Text
              style={{
                color: C.text,
                fontSize: 27,
                lineHeight: 32,
                fontWeight: "900",
                letterSpacing: -0.7,
                marginTop: 16,
              }}
            >
              Decisions that need you.
            </Text>
            <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8 }}>
              Review context, ask AI for a second opinion, then approve or deny with confidence.
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 17 }}>
              <Stat value={items.length} label="Pending" tone={C.warn} />
              <Stat value={items.filter((item) => item.source === "resolvd").length} label="Resolvd" tone={C.accent2} />
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: C.text, fontSize: 15, fontWeight: "800" }}>Approval queue</Text>
            <Text style={{ color: C.faint, fontSize: 11 }}>Pull to refresh</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View
          style={{
            alignItems: "center",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: C.border,
            backgroundColor: C.surface,
            padding: 30,
          }}
        >
          <Text style={{ color: C.good, fontSize: 24 }}>✓</Text>
          <Text style={{ color: C.text, fontWeight: "800", marginTop: 10 }}>Queue is clear</Text>
          <Text style={{ color: C.muted, textAlign: "center", fontSize: 12, lineHeight: 18, marginTop: 5 }}>
            Your agents are handling the safe work. Risky actions will appear here.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Link href={{ pathname: "/approval/[id]", params: { id: item.id } }} asChild>
          <Pressable
            style={{
              backgroundColor: C.surface,
              borderColor: C.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  borderRadius: 999,
                  backgroundColor: "#18243A",
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: C.accent, fontSize: 10, fontWeight: "800", textTransform: "uppercase" }}>
                  {item.source}
                </Text>
              </View>
              <Text style={{ color: C.faint, fontSize: 10 }}>{relativeTime(item.createdAt)}</Text>
            </View>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 16, lineHeight: 21 }}>
              {item.title}
            </Text>
            <Text style={{ color: C.warn, fontSize: 13, lineHeight: 19, marginTop: 7 }} numberOfLines={2}>
              {item.proposedAction}
            </Text>
            {item.reason ? (
              <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 9 }} numberOfLines={2}>
                {item.reason}
              </Text>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <Text style={{ color: C.accent2, fontSize: 11, fontWeight: "800" }}>Review decision</Text>
              <Text style={{ color: C.accent2, fontSize: 16 }}>→</Text>
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <View style={{ flex: 1, borderRadius: 14, backgroundColor: C.surface2, padding: 12 }}>
      <Text style={{ color: tone, fontSize: 22, fontWeight: "900" }}>{value}</Text>
      <Text style={{ color: C.faint, fontSize: 10, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
