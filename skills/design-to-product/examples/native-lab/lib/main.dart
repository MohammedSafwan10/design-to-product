import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

final evidenceBoundary = GlobalKey();
void main() => runApp(const EvidenceApp());

class EvidenceApp extends StatefulWidget {
  const EvidenceApp({super.key});
  @override
  State<EvidenceApp> createState() => _EvidenceState();
}

class _EvidenceState extends State<EvidenceApp> {
  String mode = 'Transit', message = 'Sample timetable · No live departures';
  bool offline = false, paused = false, exportFailed = false;
  int route = 0;
  double position = 12;
  final muted = <int>{}, lit = <int>{};
  final gameFocus = FocusNode();
  @override
  void dispose() {
    gameFocus.dispose();
    super.dispose();
  }

  void lightBeacon(int index) {
    if (paused) return;
    setState(() {
      if ({1, 4, 7}.contains(index)) {
        lit.add(index);
        message = lit.length == 3
            ? 'Relay complete. All three beacons are active.'
            : '${lit.length} of 3 beacons active.';
      } else {
        message = 'Wrong frequency. Active beacons retained; try 2, 5 or 8.';
      }
    });
  }

  Widget title(String text, {double size = 36, Color? color}) => Text(
    text,
    style: TextStyle(
      fontSize: size,
      fontWeight: FontWeight.w800,
      height: 1.08,
      letterSpacing: -1,
      color: color,
    ),
  );
  Widget eyebrow(String text, Color color) => Text(
    text,
    style: TextStyle(
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: FontWeight.w700,
      color: color,
    ),
  );
  @override
  Widget build(BuildContext context) => RepaintBoundary(
    key: evidenceBoundary,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xff245d54),
      ),
      home: Scaffold(
        backgroundColor: const Color(0xffedf0ec),
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 8,
                ),
                child: Wrap(
                  spacing: 12,
                  runSpacing: 6,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    const Text(
                      'D/P · NATIVE LAB',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    for (final name in ['Transit', 'Audio', 'Beacon'])
                      TextButton(
                        key: ValueKey('mode-$name'),
                        onPressed: () => setState(() {
                          mode = name;
                          message = name == 'Beacon'
                              ? 'Activate beacons 2, 5 and 8. Click or press number keys.'
                              : 'Sample timetable · No live departures';
                        }),
                        child: Text(
                          name,
                          style: TextStyle(
                            fontWeight: mode == name
                                ? FontWeight.w800
                                : FontWeight.w400,
                          ),
                        ),
                      ),
                    const Text(
                      'Local samples · No external services',
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: switch (mode) {
                  'Transit' => transit(),
                  'Audio' => audio(),
                  _ => beacon(),
                },
              ),
            ],
          ),
        ),
      ),
    ),
  );
  Widget transit() => Material(
    color: const Color(0xffdfe4de),
    child: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 440),
        child: Material(
          color: const Color(0xfffff4dc),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                eyebrow('HOP / CITY', const Color(0xff394438)),
                const SizedBox(height: 26),
                title('Across town.\nOne clear route.'),
                const SizedBox(height: 24),
                const TextField(
                  key: ValueKey('destination'),
                  decoration: InputDecoration(
                    labelText: 'Destination',
                    prefixIcon: Icon(Icons.place_outlined),
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 20),
                for (final (index, name) in [
                  'River Street · 24 min',
                  'Station Square · 31 min',
                ].indexed)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: OutlinedButton(
                      key: ValueKey('route-$index'),
                      style: OutlinedButton.styleFrom(
                        backgroundColor: route == index
                            ? const Color(0xfff2c14e)
                            : null,
                        padding: const EdgeInsets.all(18),
                        foregroundColor: const Color(0xff292f2d),
                      ),
                      onPressed: () => setState(() => route = index),
                      child: Row(
                        children: [
                          Icon(index == 0 ? Icons.directions_bus : Icons.tram),
                          const SizedBox(width: 12),
                          Expanded(child: Text(name)),
                          if (route == index) const Icon(Icons.check),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 12),
                FilledButton(
                  key: const ValueKey('review-route'),
                  onPressed: () => setState(
                    () => message = offline
                        ? 'Offline. Sample route retained; live departures unavailable.'
                        : 'Route ${route + 1} reviewed locally. No journey booked.',
                  ),
                  child: const Text('Review route'),
                ),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Offline scenario'),
                  value: offline,
                  onChanged: (value) => setState(() {
                    offline = value;
                    message = value
                        ? 'Offline. Sample route retained; live departures unavailable.'
                        : 'Sample timetable · No live departures';
                  }),
                ),
                Semantics(
                  liveRegion: true,
                  child: Text(
                    message,
                    key: const ValueKey('transit-status'),
                    style: const TextStyle(fontSize: 13, height: 1.5),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
  Widget audio() => Theme(
    data: ThemeData.dark(useMaterial3: true).copyWith(
      colorScheme: const ColorScheme.dark(
        primary: Color(0xffa4dfb7),
        surface: Color(0xff151c24),
      ),
    ),
    child: Builder(
      builder: (context) => Material(
        color: const Color(0xff151c24),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              eyebrow('TIDELINE / AUDIO WORKSPACE', const Color(0xffa4dfb7)),
              const SizedBox(height: 18),
              Wrap(
                spacing: 32,
                runSpacing: 12,
                children: [
                  title('A river, in three layers.', color: Colors.white),
                  OutlinedButton(
                    key: const ValueKey('export-audio'),
                    onPressed: () => setState(() => exportFailed = true),
                    child: const Text('Review export'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Generated waveforms · No audio file loaded',
                style: TextStyle(color: Color(0xffb1c1ce)),
              ),
              if (exportFailed)
                const Text(
                  'Export unavailable: no source media. Track selections retained.',
                  key: ValueKey('audio-status'),
                  style: TextStyle(color: Color(0xffffcd9a)),
                ),
              const SizedBox(height: 28),
              for (final (index, name) in [
                'River / close',
                'Leaves / canopy',
                'Footbridge / steps',
              ].indexed)
                Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: const Color(0xff202c36),
                      border: Border.all(color: const Color(0xff41515f)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  name,
                                  style: const TextStyle(color: Colors.white),
                                ),
                              ),
                              IconButton(
                                key: ValueKey('mute-$index'),
                                tooltip: muted.contains(index)
                                    ? 'Unmute $name'
                                    : 'Mute $name',
                                onPressed: () => setState(() {
                                  muted.contains(index)
                                      ? muted.remove(index)
                                      : muted.add(index);
                                }),
                                icon: Icon(
                                  muted.contains(index)
                                      ? Icons.volume_off
                                      : Icons.volume_up,
                                ),
                              ),
                            ],
                          ),
                          Semantics(
                            label: 'Illustrative waveform for $name',
                            image: true,
                            child: SizedBox(
                              height: 50,
                              width: double.infinity,
                              child: CustomPaint(
                                painter: WavePainter(
                                  seed: index,
                                  muted: muted.contains(index),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              Row(
                children: [
                  const Text(
                    'Playhead',
                    style: TextStyle(color: Color(0xffa4dfb7)),
                  ),
                  Expanded(
                    child: Slider(
                      key: const ValueKey('playhead'),
                      min: 0,
                      max: 60,
                      value: position,
                      label: '${position.round()} seconds',
                      onChanged: (value) => setState(() => position = value),
                    ),
                  ),
                  Text(
                    '00:${position.round().toString().padLeft(2, '0')}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontFeatures: [FontFeature.tabularFigures()],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    ),
  );
  Widget beacon() => Focus(
    focusNode: gameFocus,
    autofocus: true,
    onKeyEvent: (node, event) {
      if (event is KeyDownEvent) {
        final digit = int.tryParse(event.character ?? '');
        if (digit != null && digit >= 1 && digit <= 9) {
          lightBeacon(digit - 1);
          return KeyEventResult.handled;
        }
      }
      return KeyEventResult.ignored;
    },
    child: Material(
      color: const Color(0xff101932),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(28),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 700),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                eyebrow('BEACON / SIGNAL PUZZLE', const Color(0xff8eafff)),
                const SizedBox(height: 18),
                title(
                  'Restore the relay.',
                  size: 42,
                  color: const Color(0xffecf3ff),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'BEACONS ${lit.length} / 3',
                        style: const TextStyle(
                          color: Color(0xffa9ffc9),
                          letterSpacing: 2,
                        ),
                      ),
                    ),
                    OutlinedButton(
                      key: const ValueKey('pause-game'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xffecf3ff),
                      ),
                      onPressed: () => setState(() => paused = !paused),
                      child: Text(paused ? 'Resume' : 'Pause'),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GridView.count(
                  crossAxisCount: 3,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  childAspectRatio: 2.5,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  children: [
                    for (int index = 0; index < 9; index++)
                      Semantics(
                        label:
                            'Beacon ${index + 1}${lit.contains(index) ? ', active' : ''}',
                        button: true,
                        child: OutlinedButton(
                          key: ValueKey('beacon-$index'),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: lit.contains(index)
                                ? const Color(0xffa9ffc9)
                                : const Color(0xff202f51),
                            foregroundColor: lit.contains(index)
                                ? const Color(0xff101932)
                                : const Color(0xffecf3ff),
                            side: const BorderSide(color: Color(0xff738dbe)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          onPressed: paused ? null : () => lightBeacon(index),
                          child: Text(
                            '${index + 1}',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 22),
                Semantics(
                  liveRegion: true,
                  child: Text(
                    paused ? 'Paused. Beacon input is disabled.' : message,
                    key: const ValueKey('game-status'),
                    style: const TextStyle(
                      color: Color(0xffecf3ff),
                      fontSize: 16,
                      height: 1.5,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  key: const ValueKey('reset-game'),
                  onPressed: () => setState(() {
                    lit.clear();
                    paused = false;
                    message = 'Activate beacons 2, 5 and 8. Click or press number keys.';
                  }),
                  child: const Text(
                    'Reset relay',
                    style: TextStyle(color: Color(0xffa9ffc9)),
                  ),
                ),
                const Text(
                  'Native Flutter 2D puzzle · No 3D engine or controller claim',
                  style: TextStyle(color: Color(0xffa9b9d7), fontSize: 12),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

class WavePainter extends CustomPainter {
  WavePainter({required this.seed, required this.muted});
  final int seed;
  final bool muted;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = muted ? const Color(0xff7c8e99) : const Color(0xffa4dfb7)
      ..strokeWidth = 2;
    for (double x = 0; x < size.width; x += 5) {
      final h =
          (math.sin(x * .045 + seed) * math.cos(x * .12 + seed * 2)).abs() *
              size.height *
              .43 +
          3;
      canvas.drawLine(
        Offset(x, size.height / 2 - h),
        Offset(x, size.height / 2 + h),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(WavePainter oldDelegate) =>
      oldDelegate.seed != seed || oldDelegate.muted != muted;
}
