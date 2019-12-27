Sub TickerAnalyzer()
    'for loop each sheet
    For Each ws In Worksheets
    
        'Varible Initialization
        Dim rowI As Long
        rowI = 2
        
        Dim currrentStock As String
        currentStock = ws.Cells(2, 1).Value
        
        'Using Long and LongLong because was getting overflow with smaller data types
        Dim BeginRow As Long
        Dim EndRow As Long
        Dim currentVolume As LongLong
        currentVolume = 0
        BeginRow = 2
        Dim StockCount As Long
        StockCount = 1

        'Greatest Challege Variables
        Dim GIncrese As Double
        Dim GDecrease As Double
        Dim GVolume As LongLong
        Dim GIncName As String
        Dim GDecName As String
        Dim GVolName As String
        GIncrese = 0
        GDecrease = 0
        GVolume = 0
        
        
        'Set Headers For Output
        ws.Cells(1, 9).Value = "Ticker"
        ws.Cells(1, 10).Value = "Yearly Change"
        ws.Cells(1, 11).Value = "PercentChange"
        ws.Cells(1, 12).Value = "Total Stock Volume"
        
        'Loop While Ticker Not Empty
        Do While ws.Cells(rowI, 1).Value <> 0
            If ws.Cells(rowI, 1).Value = currentStock Then
                   currentVolume = currentVolume + ws.Cells(rowI, 7).Value
            Else
                'change in Ticker so output results
                EndRow = rowI - 1
                ws.Cells(StockCount + 1, 9).Value = currentStock
                ws.Cells(StockCount + 1, 10).Value = ws.Cells(EndRow, 6).Value - ws.Cells(BeginRow, 3).Value
                
                'ColorFormatting *will not format 0
                If ws.Cells(StockCount + 1, 10).Value > 0 Then
                    ws.Cells(StockCount + 1, 10).Interior.ColorIndex = 4
                Else
                    ws.Cells(StockCount + 1, 10).Interior.ColorIndex = 3
                End If
                
                'If Diving By Zero Set Exception
                If ws.Cells(BeginRow, 3) = 0 Then
                    ws.Cells(StockCount + 1, 11).Value = 0
                    'MsgBox("Stock with Price of Zero")
                Else
                    ws.Cells(StockCount + 1, 11).Value = ws.Cells(StockCount + 1, 10).Value / ws.Cells(BeginRow, 3).Value * 100 & "%"
                
                End If
                ws.Cells(StockCount + 1, 12).Value = currentVolume
                

                'Greatest Compare
                If currentVolume > GVolume Then
                    GVolume = currentVolume
                    GVolName = currentStock
                End If
                If ws.Cells(StockCount + 1, 11) > GIncrese Then
                    GIncrese = ws.Cells(StockCount + 1, 11)
                    GIncName = currentStock
                End If
                If ws.Cells(StockCount + 1, 11) < GDecrease Then
                    GDecrease = ws.Cells(StockCount + 1, 11)
                    GDecName = currentStock
                End If

                StockCount = StockCount + 1
                    
                'reset variables
                currentStock = ws.Cells(rowI, 1).Value
                currentVolume = ws.Cells(rowI, 7).Value
                BeginRow = rowI
            End If
            rowI = rowI + 1
        Loop

    'OutPut Greatest
        ws.Cells(1, 16).Value = "Ticker"
        ws.Cells(1, 17).Value = "Value"
        ws.Cells(2, 15).Value = "Greatest % Increase"
        ws.Cells(2, 16).Value = GIncName
        ws.Cells(2, 17).Value = GIncrese * 100 & "%"
        ws.Cells(3, 15).Value = "Greatest % Decrese"
        ws.Cells(3, 16).Value = GDecName
        ws.Cells(3, 17).Value = GDecrease * 100 & "%"
        ws.Cells(4, 15).Value = "Greatest Total Volume"
        ws.Cells(4, 16).Value = GVolName
        ws.Cells(4, 17).Value = GVolume

    Next ws
End Sub

